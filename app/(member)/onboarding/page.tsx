"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";

const STEPS = [
  {
    id: "cabin",
    question: "What cabin do you usually fly?",
    options: [
      { label: "Economy — value over comfort", value: "economy" },
      { label: "Premium Economy — best of both", value: "premium_economy" },
      { label: "Business — always", value: "business" },
      { label: "First — nothing less", value: "first" },
    ],
  },
  {
    id: "hotel_stars",
    question: "What's your minimum hotel standard?",
    options: [
      { label: "3-star — clean and functional", value: 3 },
      { label: "4-star — comfort matters", value: 4 },
      { label: "5-star — luxury is the default", value: 5 },
      { label: "Boutique — character over stars", value: "boutique" },
    ],
  },
  {
    id: "vibe",
    question: "What's your travel vibe?",
    options: [
      { label: "Adventure & outdoors", value: "adventure" },
      { label: "Culture & history", value: "culture" },
      { label: "Wellness & relaxation", value: "wellness" },
      { label: "Food & nightlife", value: "food" },
      { label: "Beaches & resorts", value: "beach" },
      { label: "City breaks", value: "city" },
    ],
    multi: true,
  },
  {
    id: "budget_band",
    question: "What's your typical trip budget per person?",
    options: [
      { label: "Under $1,000", value: "budget" },
      { label: "$1,000 – $3,000", value: "mid" },
      { label: "$3,000 – $10,000", value: "premium" },
      { label: "$10,000+", value: "luxury" },
    ],
  },
  {
    id: "travel_party",
    question: "Who do you usually travel with?",
    options: [
      { label: "Solo", value: "solo" },
      { label: "Partner", value: "couple" },
      { label: "Family with kids", value: "family" },
      { label: "Friends group", value: "group" },
      { label: "Business travel", value: "business" },
    ],
  },
  {
    id: "sustainability",
    question: "How important is sustainable travel to you?",
    options: [
      { label: "Not a factor", value: 0 },
      { label: "Somewhat important", value: 0.5 },
      { label: "Very important", value: 1 },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selected, setSelected] = useState<any>(null);
  const [multiSelected, setMultiSelected] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const current = STEPS[step];
  const isMulti = !!current?.multi;
  const isLast = step === STEPS.length - 1;
  const progress = ((step) / STEPS.length) * 100;

  function handleSelect(value: any) {
    if (isMulti) {
      setMultiSelected((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    } else {
      setSelected(value);
    }
  }

  async function handleNext() {
    const value = isMulti ? multiSelected : selected;
    const newAnswers = { ...answers, [current.id]: value };
    setAnswers(newAnswers);

    if (isLast) {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({ travel_dna: newAnswers }).eq("id", user.id);
      }
      router.push("/dashboard");
    } else {
      setStep(step + 1);
      setSelected(null);
      setMultiSelected([]);
    }
  }

  const canContinue = isMulti ? multiSelected.length > 0 : selected !== null;

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-oxblood rounded-lg flex items-center justify-center">
            <Plane className="w-4 h-4 text-white -rotate-45" />
          </div>
          <span className="font-display text-lg font-semibold text-ink">aeronix holidays</span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-stone/10 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-oxblood rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-white rounded-2xl border border-stone/10 shadow-sm p-8">
          <p className="text-stone text-xs font-medium mb-2">Step {step + 1} of {STEPS.length}</p>
          <h2 className="font-display text-2xl font-semibold text-ink mb-6">{current.question}</h2>

          <div className={`grid gap-2.5 ${isMulti ? "grid-cols-2" : "grid-cols-1"}`}>
            {current.options.map((opt) => {
              const isSelected = isMulti
                ? multiSelected.includes(opt.value)
                : selected === opt.value;
              return (
                <button
                  key={String(opt.value)}
                  onClick={() => handleSelect(opt.value)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all ${
                    isSelected
                      ? "border-oxblood bg-oxblood/5 text-oxblood"
                      : "border-stone/15 text-stone hover:border-stone/40 hover:text-ink"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-7">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-stone text-sm hover:text-ink transition-colors"
            >
              Skip for now
            </button>
            <Button
              onClick={handleNext}
              disabled={!canContinue || saving}
              className="bg-oxblood hover:bg-oxblood/90 text-white rounded-xl px-6 font-medium"
            >
              {saving ? "Saving…" : isLast ? "Finish →" : "Next →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
