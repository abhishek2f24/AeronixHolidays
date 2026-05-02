"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const PLANS = [
  {
    id: null, name: "Voyager", price: { annual: 0, monthly: 0 }, period: "Free forever",
    badge: null, highlight: false, cta: "Start for free", href: "/sign-up",
    features: [
      { text: "Search flights & hotels", included: true },
      { text: "3 Odin AI turns per day", included: true },
      { text: "Standard booking", included: true },
      { text: "Email support (48h SLA)", included: true },
      { text: "Hotel perks", included: false },
      { text: "Cancel for any reason", included: false },
      { text: "0% FX virtual card", included: false },
      { text: "Priority support", included: false },
      { text: "Personal Trip Designer", included: false },
    ],
  },
  {
    id: "atlas", name: "Atlas", price: { annual: 480, monthly: 49 }, period: "/year",
    badge: "Most popular", highlight: true, cta: "Get Atlas", href: null,
    features: [
      { text: "Search flights & hotels", included: true },
      { text: "Unlimited Odin AI turns", included: true },
      { text: "Standard booking", included: true },
      { text: "Priority chat (4h SLA)", included: true },
      { text: "1,500+ hotel perks (upgrade, credit, late checkout)", included: true },
      { text: "4× Cancel for any reason per year", included: true },
      { text: "0% FX virtual card", included: true },
      { text: "Sunday Inspiration drops", included: true },
      { text: "Personal Trip Designer", included: false },
    ],
  },
  {
    id: "odyssey", name: "Odyssey", price: { annual: 4800, monthly: 400 }, period: "/year",
    badge: "White glove", highlight: false, cta: "Get Odyssey", href: null,
    features: [
      { text: "Everything in Atlas", included: true },
      { text: "Named personal Trip Designer", included: true },
      { text: "24/7 disruption response pod", included: true },
      { text: "Unlimited DragonPass lounge access", included: true },
      { text: "$300 annual transfer credit", included: true },
      { text: "Family Travel DNA (up to 6)", included: true },
      { text: "Longevity clinic discount network", included: true },
      { text: "Priority concierge (30-min SLA)", included: true },
      { text: "Annual planning session", included: true },
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [billing, setBilling] = useState<"annual" | "monthly">("annual");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(planId: string) {
    setLoading(planId);
    const plan = billing === "annual" ? `${planId}_annual` : `${planId}_monthly`;
    const res = await fetch("/api/razorpay/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    
    if (res.status === 401) {
      router.push("/sign-in");
      return;
    }

    const data = await res.json();
    
    if (data.subscription_id) {
      const options = {
        key: data.key_id,
        subscription_id: data.subscription_id,
        name: data.name,
        description: data.description,
        prefill: data.prefill,
        handler: function (response: any) {
          router.push(`/dashboard?upgraded=1&sub=${response.razorpay_subscription_id}`);
        },
        theme: { color: "#1C1C1C" },
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    }
    
    setLoading(null);
  }

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-20 px-4 bg-cream min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-5xl sm:text-6xl font-semibold text-ink mb-4">
              Simple, honest pricing
            </h1>
            <p className="text-stone text-lg mb-8 max-w-xl mx-auto">
              Start free. Upgrade when you need more. Cancel anytime.
            </p>
            {/* Billing toggle */}
            <div className="inline-flex bg-white border border-stone/20 rounded-xl p-1 gap-1">
              {(["annual", "monthly"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    billing === b ? "bg-ink text-white shadow-sm" : "text-stone hover:text-ink"
                  }`}
                >
                  {b}
                  {b === "annual" && (
                    <span className="ml-2 text-[10px] bg-oxblood/10 text-oxblood rounded px-1.5 py-0.5">Save 18%</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Plan cards */}
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-7 border ${
                  plan.highlight
                    ? "bg-ink border-ink shadow-2xl"
                    : "bg-white border-stone/10"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-oxblood text-white border-transparent text-xs px-3 py-1">{plan.badge}</Badge>
                  </div>
                )}

                <div className="mb-6">
                  <p className={`text-sm font-medium mb-2 ${plan.highlight ? "text-white/60" : "text-stone"}`}>{plan.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`font-display text-5xl font-semibold ${plan.highlight ? "text-white" : "text-ink"}`}>
                      {plan.price[billing] === 0 ? "Free" : `$${plan.price[billing]}`}
                    </span>
                    {plan.price[billing] > 0 && (
                      <span className={`text-sm ${plan.highlight ? "text-white/50" : "text-stone"}`}>
                        /{billing === "annual" ? "yr" : "mo"}
                      </span>
                    )}
                  </div>
                  {plan.price[billing] > 0 && billing === "annual" && (
                    <p className={`text-xs mt-1 ${plan.highlight ? "text-white/40" : "text-stone/60"}`}>
                      ${Math.round(plan.price.annual / 12)}/month billed annually
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 mb-7">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2 text-sm">
                      {f.included
                        ? <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? "text-gold" : "text-oxblood"}`} />
                        : <X className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? "text-white/20" : "text-stone/30"}`} />
                      }
                      <span className={f.included
                        ? plan.highlight ? "text-white/85" : "text-stone"
                        : plan.highlight ? "text-white/30" : "text-stone/40"
                      }>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => plan.href ? router.push(plan.href) : handleCheckout(plan.id!)}
                  disabled={loading === plan.id}
                  className={`w-full h-11 rounded-xl font-medium ${
                    plan.highlight
                      ? "bg-oxblood hover:bg-oxblood/90 text-white"
                      : "border border-stone/30 bg-transparent text-ink hover:bg-ivory"
                  }`}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  {loading === plan.id ? "Loading…" : plan.cta}
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center text-stone text-sm mt-10">
            Secure payments via Razorpay · No hidden fees · Cancel anytime
          </p>
        </div>
      </main>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}
