import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getResend, FROM_EMAIL } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  
  // 1. Fetch active alerts
  const { data: alerts, error: alertsError } = await supabase
    .from("price_alerts")
    .select("*, profiles(full_name)")
    .eq("is_active", true);

  if (alertsError) return NextResponse.json({ error: alertsError.message }, { status: 500 });
  if (!alerts || alerts.length === 0) return NextResponse.json({ message: "No active alerts" });

  const resend = getResend();
  const results = [];

  for (const alert of alerts) {
    // 2. Simulate fetching live price (In production, call Skyscanner/Amadeus API here)
    const mockCurrentPrice = Math.floor(alert.target_price * 0.9); // Simulate a 10% drop
    
    if (mockCurrentPrice <= alert.target_price) {
      // 3. Send email via Resend
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: alert.user_id, // In this DB schema, user_id is the email for simplicity or we fetch it
          subject: `Price Drop Alert: ${alert.origin} to ${alert.destination}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e1da; border-radius: 16px; padding: 24px;">
              <h2 style="color: #6B1F2A; margin-bottom: 8px;">Good news, ${alert.profiles?.full_name || "Traveler"}!</h2>
              <p style="color: #8C8782; font-size: 16px;">The price for your trip from <strong>${alert.origin}</strong> to <strong>${alert.destination}</strong> has dropped.</p>
              
              <div style="background-color: #FAF7F2; padding: 20px; border-radius: 12px; margin: 24px 0; text-align: center;">
                <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #8C8782;">Current Price</p>
                <p style="margin: 4px 0; font-size: 32px; font-weight: bold; color: #6B1F2A;">₹${mockCurrentPrice.toLocaleString("en-IN")}</p>
                <p style="margin: 0; font-size: 12px; color: #C5A572;">Your target was ₹${alert.target_price.toLocaleString("en-IN")}</p>
              </div>

              <a href="https://www.aeronixholidays.com/search?type=flight&from=${alert.origin}&to=${alert.destination}" 
                 style="display: block; background-color: #6B1F2A; color: white; text-align: center; padding: 16px; border-radius: 8px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                Book This Fare Now
              </a>
              
              <p style="margin-top: 24px; font-size: 12px; color: #8C8782; text-align: center;">
                You are receiving this because you set a price alert on Aeronix Holidays. 
                <br/>© 2026 Aeronix Holidays. All rights reserved.
              </p>
            </div>
          `,
        });

        // 4. Optionally deactivate alert to prevent spam, or update last_notified_at
        await supabase
          .from("price_alerts")
          .update({ is_active: false }) // Or just update a timestamp
          .eq("id", alert.id);

        results.push({ alertId: alert.id, status: "sent" });
      } catch (e: any) {
        results.push({ alertId: alert.id, status: "error", error: e.message });
      }
    }
  }

  return NextResponse.json({ processed: alerts.length, results });
}
