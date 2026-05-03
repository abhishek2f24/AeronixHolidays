"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { User, Bell, CreditCard, Shield, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const supabase = useRouter();
  const client = createClient();
  const router = useRouter();

  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await client.auth.getUser();
      if (!user) { router.push("/sign-in"); return; }
      setEmail(user.email ?? "");
      const { data: profile } = await client.from("profiles").select("full_name, phone").eq("id", user.id).single();
      setName(profile?.full_name ?? "");
      setPhone(profile?.phone ?? "");
      setLoading(false);
    }
    load();
  }, []);  // eslint-disable-line

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await client.auth.getUser();
    if (user) {
      await client.from("profiles").update({ full_name: name, phone }).eq("id", user.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleSignOut() {
    await client.auth.signOut();
    router.push("/");
  }

  if (loading) return <div className="p-6 flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-oxblood border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-semibold text-ink mb-1">Settings</h1>
      <p className="text-stone mb-8">Manage your profile and preferences.</p>

      {/* Profile */}
      <div className="bg-white rounded-2xl border border-stone/10 p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-oxblood" />
          <h2 className="font-semibold text-ink">Profile</h2>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-ink mb-1.5 block">Full Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="h-11 rounded-xl border-stone/20 focus:border-oxblood" />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-ink mb-1.5 block">Email Address</Label>
            <Input id="email" value={email} disabled className="h-11 rounded-xl border-stone/20 bg-stone/5 text-stone cursor-not-allowed" />
            <p className="text-[11px] text-stone/60 mt-1">Email cannot be changed. Contact support if needed.</p>
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-ink mb-1.5 block">Phone Number</Label>
            <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="h-11 rounded-xl border-stone/20 focus:border-oxblood" />
          </div>
          <Button type="submit" disabled={saving} className="bg-oxblood hover:bg-oxblood/90 text-white rounded-xl h-11 px-8 font-medium gap-2">
            {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : saving ? "Saving…" : "Save Changes"}
          </Button>
        </form>
      </div>

      {/* Notifications placeholder */}
      <div className="bg-white rounded-2xl border border-stone/10 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-oxblood" />
          <h2 className="font-semibold text-ink">Notifications</h2>
        </div>
        <p className="text-stone text-sm">Email and push notification preferences coming soon.</p>
      </div>

      {/* Travel Preferences */}
      <div className="bg-white rounded-2xl border border-stone/10 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4 text-oxblood" />
          <h2 className="font-semibold text-ink">Travel Preferences</h2>
        </div>
        <p className="text-stone text-sm mb-4">Update your travel style so Odin can give better recommendations.</p>
        <Button variant="outline" className="rounded-xl border-stone/20 text-ink" onClick={() => router.push("/onboarding")}>
          Retake Travel DNA Quiz
        </Button>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-red-500" />
          <h2 className="font-semibold text-ink">Account</h2>
        </div>
        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}
