"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { name: "Features", href: "#features" },
  { name: "Destinations", href: "#destinations" },
];

export function Navigation({ transparent = false }: { transparent?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="absolute top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 md:px-6 py-4 bg-transparent"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center group pl-0 md:pl-6">
          <img
            src="/logo3.png"
            alt="Aeronix"
            className="h-14 md:h-18 w-auto transition-transform duration-500 group-hover:scale-105"
            style={{ mixBlendMode: "screen" }}
          />
        </Link>

        {/* Desktop Navigation & Actions */}
        <div className="hidden md:flex items-center gap-8 lg:gap-16">
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

          <div className="flex items-center gap-6 md:gap-8">
            <Link
              href="/sign-in"
              className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/80 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link href="/signup">
              <Button
                className="bg-gradient-to-r from-[#6B1F2A] to-[#8B2A38] hover:to-[#A03545] text-white text-[11px] uppercase tracking-[0.2em] font-extrabold px-6 md:px-10 h-10 md:h-12 rounded-none border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.05] active:scale-[0.98]"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#0A0B10]/95 backdrop-blur-md border-b border-white/10 px-6 py-6 flex flex-col gap-4"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[12px] uppercase tracking-[0.2em] font-medium text-white/70 hover:text-[#C5A572] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
              <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-white/20 text-white/80 bg-transparent text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-white/10 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-[#6B1F2A] to-[#8B2A38] text-white text-[11px] uppercase tracking-[0.2em] font-extrabold">
                  Create Account
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

