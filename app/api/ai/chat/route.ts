export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getAnthropic, ODIN_SYSTEM } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";

type AnthropicTool = NonNullable<Parameters<ReturnType<typeof getAnthropic>["messages"]["create"]>[0]["tools"]>[number];
const TOOLS: AnthropicTool[] = [
  {
    name: "search_flights",
    description: "Search for available flights between two cities on a date",
    input_schema: {
      type: "object" as const,
      properties: {
        origin:      { type: "string", description: "IATA airport code e.g. DEL, LHR" },
        destination: { type: "string", description: "IATA airport code e.g. BOM, CDG" },
        date:        { type: "string", description: "Departure date YYYY-MM-DD" },
        cabin:       { type: "string", enum: ["economy","premium_economy","business","first"] },
        passengers:  { type: "number" },
      },
      required: ["origin", "destination", "date"],
    },
  },
  {
    name: "search_hotels",
    description: "Search for hotels at a destination",
    input_schema: {
      type: "object" as const,
      properties: {
        destination: { type: "string" },
        check_in:    { type: "string", description: "YYYY-MM-DD" },
        check_out:   { type: "string", description: "YYYY-MM-DD" },
        guests:      { type: "number" },
      },
      required: ["destination", "check_in", "check_out"],
    },
  },
];

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function runTool(name: string, input: Record<string, any>): Promise<string> {
  const base = getBaseUrl();
  try {
    if (name === "search_flights") {
      const { origin, destination, date, cabin = "ECONOMY", passengers = 1 } = input;
      const res = await fetch(`${base}/api/search/flights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: origin, to: destination, depart: date, cabin, adults: passengers }),
      });
      const data = await res.json();
      const offers = (data.offers ?? []).slice(0, 5).map((o: any) => ({
        airline:     o.airline,
        flight:      o.flight_number,
        departs:     o.departure.time,
        arrives:     o.arrival.time,
        duration:    o.duration,
        stops:       o.stops,
        price_inr:   o.total_amount,
        cabin:       o.cabin,
        bags:        o.bags_included,
        refundable:  o.is_refundable,
      }));
      return offers.length > 0
        ? JSON.stringify(offers)
        : "No flights found for this route and date.";
    }

    if (name === "search_hotels") {
      const { destination, check_in, check_out, guests = 2 } = input;
      const res = await fetch(`${base}/api/search/hotels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, checkIn: check_in, checkOut: check_out, adults: guests }),
      });
      const data = await res.json();
      const hotels = (data.hotels ?? []).slice(0, 5).map((h: any) => ({
        name:        h.name,
        stars:       h.stars,
        price_night: h.price_per_night,
        currency:    h.currency,
        board:       h.board_type,
        room:        h.room_type,
        refundable:  h.is_refundable,
      }));
      return hotels.length > 0
        ? JSON.stringify(hotels)
        : "No hotels found at this destination.";
    }
  } catch {
    return "Search temporarily unavailable. Please try again.";
  }
  return "Unknown tool.";
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message, thread_id } = await req.json();

  const { data: profile } = await supabase
    .from("profiles").select("travel_dna, tier").eq("id", user.id).single();

  // Load existing thread history
  let thread: any = null;
  if (thread_id) {
    const { data } = await supabase
      .from("ai_threads").select("*").eq("id", thread_id).eq("user_id", user.id).single();
    thread = data;
  }

  const history: { role: "user" | "assistant"; content: string }[] = thread?.messages ?? [];
  history.push({ role: "user", content: message });

  const systemWithDNA = profile?.travel_dna
    ? `${ODIN_SYSTEM}\n\nUser travel preferences: ${JSON.stringify(profile.travel_dna)}\nMembership tier: ${profile.tier ?? "voyager"}`
    : ODIN_SYSTEM;

  const anthropic = getAnthropic();

  // Build message array — Anthropic accepts string content for simple turns
  let messages: any[] = history.map((m) => ({ role: m.role, content: m.content }));

  let response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemWithDNA,
    tools: TOOLS,
    messages,
  });

  // Agentic tool loop — keep running until no more tool calls
  let loopGuard = 0;
  while (response.stop_reason === "tool_use" && loopGuard < 3) {
    loopGuard++;
    const toolUseBlocks = (response.content as any[]).filter((b) => b.type === "tool_use");
    const toolResults: any[] = [];

    for (const tu of toolUseBlocks) {
      const result = await runTool(tu.name as string, tu.input as Record<string, any>);
      toolResults.push({ type: "tool_result", tool_use_id: tu.id as string, content: result });
    }

    // Append assistant turn (with tool_use blocks) + user turn (with tool_result blocks)
    messages = [
      ...messages,
      { role: "assistant", content: response.content },
      { role: "user",      content: toolResults },
    ];

    response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemWithDNA,
      tools: TOOLS,
      messages,
    });
  }

  const assistantText = response.content
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("\n")
    || "I'm sorry, I didn't get a response. Please try again.";

  history.push({ role: "assistant", content: assistantText });

  let returnedThreadId = thread_id;
  if (thread_id) {
    await supabase.from("ai_threads")
      .update({ messages: history, updated_at: new Date().toISOString() })
      .eq("id", thread_id);
  } else {
    const { data: newThread } = await supabase.from("ai_threads").insert({
      user_id: user.id,
      title:   message.slice(0, 80),
      messages: history,
    }).select("id").single();
    returnedThreadId = newThread?.id;
  }

  return NextResponse.json({ reply: assistantText, thread_id: returnedThreadId });
}
