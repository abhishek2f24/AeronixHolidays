"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window { Razorpay: any; }
}

const PLANS = [
  {
    key:      "voyager" as const,
    label:    "Voyager",
    price:    "Free",
    period:   "forever",
    icon:     Sparkles,
    color:    "text-stone",
    badge:    "Get Started",
    popular:  false,
    features: [
      "3 Odin AI trip plans per month",
      "Flight & hotel search",
      "Basic price alerts",
      "Community support",
    ],
  },
  {
    key:     "atlas_annual" as const,
    label:   "Atlas",
    price:   "₹480",
    period:  "per year",
    icon:    Zap,
    color:   "text-oxblood",
    badge:   "Most Popular",
    popular: true,
    features: [
      "Unlimited Odin AI trip plans",
      "Real-time flight & hotel search",
      "Fare lock (hold prices 24h)",
      "VIP hotel upgrade requests",
      "4-hour concierge response",
      "Priority email support",
    ],
  },
  {
    key:     "odyssey_annual" as const,
    label:   "Odyssey",
    price:   "₹4,800",
    period:  "per year",
    icon:    Crown,
    color:   "text-amber-600",
    badge:   "Ultra Premium",
    popular: false,
    features: [
      "Everything in Atlas",
      "30-minute concierge response",
      "Dedicated travel manager",
      "Private jet charter access",
      "Exclusive partner upgrades",
      "0% forex on travel spend",
    ],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function handleUpgrade(planKey: "atlas_annual" | "odyssey_annual") {
    setLoading(planKey);
    setMessage("");
    try {
      const res = await fetch("/api/razorpay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });

      if (res.status === 401) {
        window.location.href = "/sign-in?redirect=/pricing";
        return;
      }

      const data = await res.json();
      if (data.error) { setMessage(data.error); setLoading(null); return; }

      // Load Razorpay SDK dynamically
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Razorpay"));
          document.body.appendChild(script);
        });
      }

      const rzp = new window.Razorpay({
        key:         data.key_id,
        amount:      data.amount,
        currency:    data.currency,
        name:        data.name,
        description: data.description,
        order_id:    data.order_id,
        prefill:     data.prefill,
        theme:       { color: "#6B1F2A" },
        handler: () => {
          setMessage("Payment successful! Your membership is being upgraded. Please refresh in a moment.");
        },
        modal: {
          ondismiss: () => setLoading(null),
        },
      });

      rzp.open();
    } catch (err: any) {
      setMessage(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navigation />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        <div className="text-center mb-16">
          <Badge className="bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20 px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.4em] font-extrabold mb-6">
            Membership Plans
          </Badge>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-[#0A0B10] mb-4">
            Choose your <span className="text-[#C5A059]">journey</span>
          </h1>
          <p className="text-[#8C8782] text-lg max-w-xl mx-auto">
            From free exploration to full-service luxury concierge. Upgrade anytime, cancel anytime.
          </p>
        </div>

        {message && (
          <div className="max-w-lg mx-auto mb-8 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm text-center">
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div key={plan.key} className={cn(
                "relative bg-white rounded-[32px] p-8 border transition-shadow hover:shadow-xl",
                plan.popular ? "border-[#6B1F2A] shadow-lg" : "border-[#E5E1DA]"
              )}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#6B1F2A] text-white border-transparent px-4 py-1 text-[10px] uppercase tracking-widest">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", plan.popular ? "bg-oxblood/10" : "bg-stone/5")}>
                  <Icon className={cn("w-6 h-6", plan.color)} />
                </div>

                <h2 className="font-display text-2xl font-bold text-[#1A1A1A] mb-1">{plan.label}</h2>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display text-4xl font-bold text-[#1A1A1A]">{plan.price}</span>
                  {plan.period !== "forever" && <span className="text-stone text-sm">/{plan.period}</span>}
                </div>
                <p className="text-stone text-xs mb-8">{plan.period === "forever" ? "No credit card required" : "Billed annually"}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-stone">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.key === "voyager" ? (
                  <Button variant="outline" className="w-full h-12 rounded-xl border-stone/20 text-ink font-bold" onClick={() => window.location.href = "/sign-up"}>
                    Get Started Free
                  </Button>
                ) : (
                  <Button
                    className={cn("w-full h-12 rounded-xl font-bold uppercase tracking-wider text-xs",
                      plan.popular ? "bg-[#6B1F2A] hover:bg-[#8B2A38] text-white shadow-lg" : "bg-[#1A1A1A] hover:bg-[#333] text-white"
                    )}
                    onClick={() => handleUpgrade(plan.key as "atlas_annual" | "odyssey_annual")}
                    disabled={loading === plan.key}
                  >
                    {loading === plan.key ? "Processing…" : `Upgrade to ${plan.label}`}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-stone text-xs mt-10">
          All plans include SSL-secured payments via Razorpay · Cancel anytime · 7-day money-back guarantee
        </p>
      </main>

      <Footer />
    </div>
  );
}
