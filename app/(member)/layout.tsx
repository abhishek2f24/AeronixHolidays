import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  LayoutDashboard, Search, Sparkles, Briefcase,
  MessageSquare, Settings, Plane, LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const NAV = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Dashboard" },
  { href: "/search",     icon: Search,          label: "Search" },
  { href: "/plan",       icon: Sparkles,        label: "Ask Odin" },
  { href: "/trips",      icon: Briefcase,       label: "My Trips" },
  { href: "/concierge",  icon: MessageSquare,   label: "Concierge" },
  { href: "/settings",   icon: Settings,        label: "Settings" },
];

const TIER_COLORS: Record<string, string> = {
  voyager: "bg-stone/10 text-stone",
  atlas:   "bg-oxblood/10 text-oxblood",
  odyssey: "bg-gold/10 text-gold",
};

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, tier")
    .eq("id", user.id)
    .single();

  const tier = profile?.tier ?? "voyager";
  const name = profile?.full_name ?? user.email?.split("@")[0] ?? "Traveler";
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex w-60 bg-white border-r border-stone/10 flex-col fixed h-full z-40">
        {/* Logo */}
        <div className="px-5 h-16 flex items-center border-b border-stone/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-oxblood rounded-md flex items-center justify-center">
              <Plane className="w-3.5 h-3.5 text-white -rotate-45" />
            </div>
            <span className="font-display text-sm font-semibold text-ink">aeronix holidays</span>
          </Link>
        </div>

        {/* User */}
        <div className="px-4 py-4 border-b border-stone/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-oxblood/10 flex items-center justify-center">
              <span className="text-oxblood text-sm font-semibold">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-ink text-sm font-medium truncate">{name}</p>
              <Badge className={`text-[10px] px-1.5 py-0 capitalize ${TIER_COLORS[tier]}`}>{tier}</Badge>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone hover:bg-ivory hover:text-ink text-sm font-medium transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.label === "Ask Odin" && (
                <span className="ml-auto text-[10px] font-semibold bg-oxblood/10 text-oxblood rounded px-1.5 py-0.5">AI</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-stone/10">
          <form action={signOut}>
            <button type="submit" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone hover:bg-red-50 hover:text-red-600 text-sm font-medium transition-colors w-full">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 md:ml-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}
