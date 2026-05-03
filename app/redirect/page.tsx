"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Loader2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { clearPendingBooking } from "@/lib/local-history";

function RedirectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const type = searchParams.get("type") || "flight";
  const name = searchParams.get("name") || "Partner Site";
  const url = searchParams.get("url") || "https://www.skyscanner.co.in";

  useEffect(() => {
    async function logRedirect() {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from("redirect_logs").insert({
        user_id: user?.id,
        type: type,
        partner_name: name,
        url: url,
        destination: searchParams.get("dest") || null
      });
    }

    logRedirect();

    // User is heading to partner to complete the booking — clear the "pending" state
    clearPendingBooking();

    // Artificial delay for premium feel
    const timer = setTimeout(() => {
      window.location.href = url;
    }, 2500);

    return () => clearTimeout(timer);
  }, [url, type, name, supabase, searchParams]);

  return (
    <div className="min-h-screen bg-[#080A0F] text-white flex flex-col">
      <Navigation />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-oxblood/20 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 rounded-full border-2 border-oxblood/30 animate-ping" />
          <Loader2 className="w-10 h-10 text-[#C5A572] animate-spin" />
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-[#C5A572] to-white bg-clip-text text-transparent">
          Securing your luxury fare...
        </h1>
        
        <p className="text-white/40 text-sm md:text-base max-w-md mb-12 leading-relaxed">
          Odin is synchronizing with {name} to finalize your exclusive {type} arrangements. You will be redirected in a moment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <ShieldCheck className="w-6 h-6 text-[#C5A572] mx-auto mb-3" />
            <p className="text-[11px] uppercase tracking-widest font-bold text-white/30 mb-1">Protection</p>
            <p className="text-xs font-medium text-white/80">Best Price Guarantee</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <Zap className="w-6 h-6 text-[#C5A572] mx-auto mb-3" />
            <p className="text-[11px] uppercase tracking-widest font-bold text-white/30 mb-1">Efficiency</p>
            <p className="text-xs font-medium text-white/80">Direct Partner Access</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-6 h-6 border-2 border-[#C5A572] rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-[10px] font-bold">AI</span>
            </div>
            <p className="text-[11px] uppercase tracking-widest font-bold text-white/30 mb-1">Intelligence</p>
            <p className="text-xs font-medium text-white/80">Smart Fare Verification</p>
          </div>
        </div>

        <button 
          onClick={() => window.location.href = url}
          className="mt-12 group flex items-center gap-2 text-[#C5A572] hover:text-white transition-colors text-sm font-medium"
        >
          Taking too long? Click here to proceed <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </main>

      <footer className="py-8 border-t border-white/5 text-center">
        <p className="text-[10px] text-white/20 tracking-widest uppercase">Aeronix Luxury Direct · Secured Redirect</p>
      </footer>
    </div>
  );
}

export default function RedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080A0F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C5A572] animate-spin" />
      </div>
    }>
      <RedirectContent />
    </Suspense>
  );
}
