import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plane, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SidebarNavLinks, MobileBottomNav } from "@/components/sidebar-nav";

const TIER_COLORS: Record<string, string> = {
  voyager: "bg-stone/10 text-stone",
  atlas:   "bg-oxblood/10 text-oxblood",
  odyssey: "bg-gold/10 text-gold",
};

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Preserve the intended destination so sign-in can redirect back
    const heads = await headers();
    const pathname = heads.get("x-pathname") ?? "/dashboard";
    const search   = heads.get("x-search") ?? "";
    redirect(`/sign-in?redirect=${encodeURIComponent(pathname + search)}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, tier")
    .eq("id", user.id)
    .single();

  const tier      = profile?.tier ?? "voyager";
  const name      = profile?.full_name ?? user.email?.split("@")[0] ?? "Traveler";
  const initials  = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* ── Desktop Sidebar ── */}
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

        {/* Nav links — client component for active state */}
        <SidebarNavLinks />

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-stone/10">
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone hover:bg-red-50 hover:text-red-600 text-sm font-medium transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 md:ml-60 min-h-screen pb-20 md:pb-0">
        {children}
      </main>

      {/* ── Mobile bottom nav — client component ── */}
      <MobileBottomNav />
    </div>
  );
}
