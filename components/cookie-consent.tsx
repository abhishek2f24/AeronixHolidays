"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";
import Link from "next/link";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[100]"
        >
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl p-6 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-oxblood/5 blur-3xl -mr-12 -mt-12" />
            
            <div className="flex gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-oxblood/10 flex items-center justify-center shrink-0">
                <Cookie className="w-6 h-6 text-oxblood" />
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">Cookie Preferences</h3>
                <p className="text-stone text-xs leading-relaxed mb-4">
                  We use cookies to enhance your luxury travel experience and analyze site traffic. By clicking "Accept", you agree to our use of cookies as detailed in our <Link href="/privacy" className="text-oxblood underline">Privacy Policy</Link>.
                </p>
                <div className="flex gap-3">
                  <Button 
                    onClick={accept}
                    className="bg-oxblood hover:bg-oxblood/90 text-white rounded-lg px-6 h-10 text-xs font-bold uppercase tracking-widest"
                  >
                    Accept All
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShow(false)}
                    className="text-stone hover:text-ink text-xs font-bold uppercase tracking-widest"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 text-stone/40 hover:text-stone transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
