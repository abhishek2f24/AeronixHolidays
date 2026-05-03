"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Plane, Hotel, Palmtree, Tag, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { name: "Flights",  href: "/search?type=flight", icon: Plane    },
  { name: "Hotels",   href: "/search?type=hotel",  icon: Hotel    },
  { name: "Holidays", href: "/packages",            icon: Palmtree },
  { name: "Offers",   href: "/offers",             icon: Tag      },
];

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState as reactState } from "react";

export function Navigation({ transparent = false }: { transparent?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = reactState(false);

  useEffect(() => setMounted(true), []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="absolute top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 md:px-6 py-4 bg-transparent"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group pl-0 md:pl-2">
          <img
            src="/logo3.png"
            alt="Aeronix Holidays"
            className="h-12 md:h-16 w-auto transition-transform duration-500 group-hover:scale-105"
            style={{ mixBlendMode: "screen" }}
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] uppercase tracking-[0.15em] font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <link.icon className="w-3.5 h-3.5" />
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 text-white/80 hover:text-white"
            aria-label="Toggle theme"
          >
            {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
          </button>
          <Link
            href="/sign-in"
            className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/80 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link href="/sign-up">
            <Button
              className="bg-gradient-to-r from-[#6B1F2A] to-[#8B2A38] hover:to-[#A03545] text-white text-[11px] uppercase tracking-[0.2em] font-extrabold px-6 h-10 rounded-none border border-white/10 shadow-xl transition-all duration-300 hover:scale-[1.05]"
            >
              Free Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#0A0B10]/97 backdrop-blur-md border-b border-white/10 px-6 py-6 flex flex-col gap-3"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-[12px] uppercase tracking-[0.2em] font-bold text-white/70 hover:text-white transition-colors py-1"
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
              <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-white/20 text-white/80 bg-transparent text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-white/10 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-[#6B1F2A] to-[#8B2A38] text-white text-[11px] uppercase tracking-[0.2em] font-extrabold">
                  Free Sign Up
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
