"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plane, Mail, Globe2 } from "lucide-react";
import { Suspense } from "react";

import { Phone, ArrowRight } from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";
  const supabase = createClient();

  const [mode, setMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}` },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSent(true);
  }

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Ensure phone starts with +
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSent(true);
    setVerifying(true);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: "sms",
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    if (data.user) {
      router.push(redirect);
    }
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}` },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-oxblood rounded-lg flex items-center justify-center">
            <Plane className="w-4 h-4 text-white -rotate-45" />
          </div>
          <span className="font-display text-lg font-semibold text-ink">aeronix holidays</span>
        </Link>

        <div className="bg-white rounded-2xl border border-stone/10 shadow-sm p-8">
          {sent && mode === "email" ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-oxblood/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-oxblood" />
              </div>
              <h2 className="font-display text-xl font-semibold text-ink mb-2">Check your email</h2>
              <p className="text-stone text-sm">We sent a sign-in link to <strong>{email}</strong>. Click it to continue.</p>
            </div>
          ) : sent && verifying ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="font-display text-xl font-semibold text-ink mb-2">Enter verification code</h2>
                <p className="text-stone text-sm">A 6-digit code has been sent to your phone.</p>
              </div>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  required
                  className="h-11 rounded-xl text-center text-lg tracking-[0.5em] font-bold"
                  maxLength={6}
                />
                <Button type="submit" disabled={loading} className="w-full h-11 bg-oxblood hover:bg-oxblood/90 text-white rounded-xl font-medium">
                  {loading ? "Verifying…" : "Verify & Continue"}
                </Button>
              </form>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-semibold text-ink mb-1">Welcome back</h1>
              <p className="text-stone text-sm mb-6">Sign in to your account</p>

              {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>}

              {/* Google */}
              <Button variant="outline" className="w-full h-11 mb-4 gap-2 rounded-xl border-stone/20" onClick={handleGoogle}>
                <Globe2 className="w-4 h-4" />
                Continue with Google
              </Button>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-stone/10" />
                <span className="text-stone text-[10px] uppercase tracking-widest font-bold">or</span>
                <div className="flex-1 h-px bg-stone/10" />
              </div>

              {/* Toggle Email/Phone */}
              <div className="flex bg-stone-50 p-1 rounded-xl mb-6">
                <button
                  onClick={() => setMode("email")}
                  className={cn("flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all", mode === "email" ? "bg-white text-oxblood shadow-sm" : "text-stone")}
                >
                  Email
                </button>
                <button
                  onClick={() => setMode("phone")}
                  className={cn("flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all", mode === "phone" ? "bg-white text-oxblood shadow-sm" : "text-stone")}
                >
                  Mobile
                </button>
              </div>

              {mode === "email" ? (
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-stone">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="h-11 rounded-xl border-stone-200"
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-11 bg-oxblood hover:bg-oxblood/90 text-white rounded-xl font-bold uppercase tracking-widest text-[10px]">
                    {loading ? "Sending…" : "Send magic link"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest font-bold text-stone">Mobile Number</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-stone font-medium">+91</span>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="99999 99999"
                        required
                        className="h-11 rounded-xl border-stone-200 pl-12"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-11 bg-oxblood hover:bg-oxblood/90 text-white rounded-xl font-bold uppercase tracking-widest text-[10px]">
                    {loading ? "Sending OTP…" : "Send OTP"}
                  </Button>
                </form>
              )}
            </>
          )}
        </div>

        <p className="text-center text-stone text-sm mt-6">
          No account?{" "}
          <Link href="/sign-up" className="text-oxblood hover:underline font-medium">Get started free</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return <Suspense><SignInForm /></Suspense>;
}
