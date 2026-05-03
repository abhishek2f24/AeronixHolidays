"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plane, Mail, Globe2, Check } from "lucide-react";

const PERKS = [
  "Search flights & hotels instantly",
  "3 free Odin AI trip plans",
  "Upgrade to Atlas anytime",
];

export default function SignUpPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/onboarding`,
      },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSent(true);
  }

  async function handleGoogle() {
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=/onboarding` },
    });
    if (oauthError) setError(oauthError.message);
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-oxblood rounded-lg flex items-center justify-center">
            <Plane className="w-4 h-4 text-white -rotate-45" />
          </div>
          <span className="font-display text-lg font-semibold text-ink">aeronix holidays</span>
        </Link>

        <div className="bg-white rounded-2xl border border-stone/10 shadow-sm p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-oxblood/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-oxblood" />
              </div>
              <h2 className="font-display text-xl font-semibold text-ink mb-2">Check your email</h2>
              <p className="text-stone text-sm">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-semibold text-ink mb-1">Create your account</h1>
              <p className="text-stone text-sm mb-4">Free forever. No credit card needed.</p>

              <ul className="space-y-1.5 mb-6">
                {PERKS.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-xs text-stone">
                    <Check className="w-3.5 h-3.5 text-oxblood shrink-0" />{p}
                  </li>
                ))}
              </ul>

              {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>}

              <Button variant="outline" className="w-full h-11 mb-4 gap-2 rounded-xl border-stone/20" onClick={handleGoogle}>
                <Globe2 className="w-4 h-4" />
                Continue with Google
              </Button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-stone/10" />
                <span className="text-stone text-xs">or</span>
                <div className="flex-1 h-px bg-stone/10" />
              </div>

              <form onSubmit={handleSignUp} className="space-y-3">
                <div>
                  <Label htmlFor="name" className="text-sm text-ink font-medium">Full name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="mt-1 h-11 rounded-xl border-stone/20 focus:border-oxblood" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm text-ink font-medium">Email address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1 h-11 rounded-xl border-stone/20 focus:border-oxblood" />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-11 bg-oxblood hover:bg-oxblood/90 text-white rounded-xl font-medium">
                  {loading ? "Creating account…" : "Create free account →"}
                </Button>
              </form>

              <p className="text-[11px] text-stone/60 mt-4 text-center">
                By signing up you agree to our{" "}
                <Link href="/terms" className="underline">Terms</Link> and{" "}
                <Link href="/privacy" className="underline">Privacy Policy</Link>.
              </p>
            </>
          )}
        </div>

        <p className="text-center text-stone text-sm mt-6">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-oxblood hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
