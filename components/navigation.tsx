"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Features", href: "#features" },
  { name: "Destinations", href: "#destinations" },
];

export function Navigation({ transparent = false }: { transparent?: boolean }) {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="absolute top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-6 py-4 bg-transparent"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center group pl-6">
          <img
            src="/logo3.png"
            alt="Aeronix"
            className="h-18 w-auto transition-transform duration-500 group-hover:scale-105"
            style={{ mixBlendMode: "screen" }}
          />
        </Link>

        {/* Navigation & Actions Grouped Right */}
        <div className="flex items-center gap-16">
          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[11px] uppercase tracking-[0.2em] font-medium text-white/70 hover:text-[#C5A572] transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C5A572] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-8">
            <Link
              href="/sign-in"
              className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/80 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link href="/signup">
              <Button
                className="bg-gradient-to-r from-[#6B1F2A] to-[#8B2A38] hover:to-[#A03545] text-white text-[11px] uppercase tracking-[0.2em] font-extrabold px-10 h-12 rounded-none border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.05] active:scale-[0.98]"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

