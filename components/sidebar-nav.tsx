"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Search, Sparkles, Briefcase,
  MessageSquare, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Dashboard" },
  { href: "/search",     icon: Search,          label: "Search"    },
  { href: "/plan",       icon: Sparkles,        label: "Ask Odin"  },
  { href: "/trips",      icon: Briefcase,       label: "My Trips"  },
  { href: "/concierge",  icon: MessageSquare,   label: "Concierge" },
  { href: "/settings",   icon: Settings,        label: "Settings"  },
];

export function SidebarNavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              active
                ? "bg-oxblood/8 text-oxblood"
                : "text-stone hover:bg-ivory hover:text-ink"
            )}
          >
            <item.icon className={cn("w-4 h-4", active && "text-oxblood")} />
            {item.label}
            {item.label === "Ask Odin" && (
              <span className="ml-auto text-[10px] font-semibold bg-oxblood/10 text-oxblood rounded px-1.5 py-0.5">AI</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/** Mobile bottom navigation bar */
export function MobileBottomNav() {
  const pathname = usePathname();
  // Show only the 5 most important items on mobile
  const mobileItems = NAV_ITEMS.slice(0, 5);
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone/10 flex items-center justify-around px-2 py-2 safe-area-pb">
      {mobileItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-0",
              active ? "text-oxblood" : "text-stone"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="text-[10px] font-medium truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
