"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, CheckCircle, Clock, Phone, Mail, Headphones } from "lucide-react";

const CATEGORIES = [
  "Booking assistance", "Flight disruption", "Hotel issue",
  "Itinerary planning", "Visa help", "General enquiry",
];

export default function ConciergePage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/concierge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: `${category}: ${subject}`, message }),
    });
    setLoading(false);
    if (!res.ok) { setError("Failed to send. Please try again."); return; }
    setSent(true);
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink mb-1">Concierge</h1>
        <p className="text-stone">Our team responds personally to every request.</p>
      </div>

      {/* Support info */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {[
          { label: "Response Time",    value: "Within 24 hours",  icon: Clock,        color: "text-oxblood" },
          { label: "Available",        value: "Mon–Sat 9am–9pm",  icon: Headphones,   color: "text-blue-600" },
          { label: "Emergency",        value: "WhatsApp 24/7",    icon: Phone,        color: "text-green-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-stone/10 p-4 flex items-center gap-3">
            <Icon className={`w-4 h-4 shrink-0 ${color}`} />
            <div>
              <p className="text-ink text-xs font-semibold">{label}</p>
              <p className="text-stone text-xs">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {sent ? (
        <div className="bg-white rounded-2xl border border-stone/10 p-10 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-semibold text-ink mb-2">Request received</h2>
          <p className="text-stone">We&apos;ll get back to you based on your membership SLA. Check your email for confirmation.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone/10 p-7">
          <div className="flex items-center gap-2 mb-5">
            <MessageSquare className="w-5 h-5 text-oxblood" />
            <h2 className="font-display text-xl font-semibold text-ink">New request</h2>
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-ink mb-1.5 block">Category</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                      category === c
                        ? "border-oxblood bg-oxblood/5 text-oxblood"
                        : "border-stone/20 text-stone hover:border-stone/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="subject" className="text-sm font-medium text-ink mb-1.5 block">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief subject line"
                required
                className="h-11 rounded-xl border-stone/20 focus:border-oxblood"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium text-ink mb-1.5 block">Message</Label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your request in detail…"
                required
                rows={5}
                className="w-full rounded-xl border border-stone/20 px-3 py-2.5 text-sm text-ink focus:border-oxblood focus:outline-none focus:ring-2 focus:ring-oxblood/10 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-oxblood hover:bg-oxblood/90 text-white rounded-xl h-11 px-8 font-medium"
            >
              {loading ? "Sending…" : "Submit request →"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
