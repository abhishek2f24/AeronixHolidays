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

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message, thread_id } = await req.json();

  const { data: profile } = await supabase.from("profiles").select("travel_dna, tier").eq("id", user.id).single();

  let thread = null;
  if (thread_id) {
    const { data } = await supabase.from("ai_threads").select("*").eq("id", thread_id).eq("user_id", user.id).single();
    thread = data;
  }

  const history: { role: "user" | "assistant"; content: string }[] = thread?.messages ?? [];
  history.push({ role: "user", content: message });

  const systemWithDNA = profile?.travel_dna
    ? `${ODIN_SYSTEM}\n\nUser travel preferences: ${JSON.stringify(profile.travel_dna)}\nMembership tier: ${profile.tier ?? "voyager"}`
    : ODIN_SYSTEM;

  const anthropic = getAnthropic();
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemWithDNA,
    tools: TOOLS,
    messages: history.map((m) => ({ role: m.role, content: m.content })),
  });

  const assistantText = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("\n");

  history.push({ role: "assistant", content: assistantText });

  if (thread_id) {
    await supabase.from("ai_threads").update({ messages: history, updated_at: new Date().toISOString() }).eq("id", thread_id);
  } else {
    const { data: newThread } = await supabase.from("ai_threads").insert({
      user_id: user.id,
      title: message.slice(0, 80),
      messages: history,
    }).select("id").single();
    return NextResponse.json({ reply: assistantText, thread_id: newThread?.id });
  }

  return NextResponse.json({ reply: assistantText, thread_id });
}
