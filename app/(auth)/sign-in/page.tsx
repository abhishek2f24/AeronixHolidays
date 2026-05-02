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

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
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

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}` },
    });
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
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-oxblood/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-oxblood" />
              </div>
              <h2 className="font-display text-xl font-semibold text-ink mb-2">Check your email</h2>
              <p className="text-stone text-sm">We sent a sign-in link to <strong>{email}</strong>. Click it to continue.</p>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-semibold text-ink mb-1">Welcome back</h1>
              <p className="text-stone text-sm mb-6">Sign in to your aeronix holidays account</p>

              {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>}

              {/* Google */}
              <Button variant="outline" className="w-full h-11 mb-4 gap-2 rounded-xl border-stone/20" onClick={handleGoogle}>
                <Globe2 className="w-4 h-4" />
                Continue with Google
              </Button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-stone/10" />
                <span className="text-stone text-xs">or</span>
                <div className="flex-1 h-px bg-stone/10" />
              </div>

              {/* Magic link */}
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm text-ink font-medium">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="mt-1 h-11 rounded-xl border-stone/20 focus:border-oxblood"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-11 bg-oxblood hover:bg-oxblood/90 text-white rounded-xl font-medium">
                  {loading ? "Sending…" : "Send magic link"}
                </Button>
              </form>
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
