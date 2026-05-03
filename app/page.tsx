"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { SearchWidget } from "@/components/search-widget";
import { Footer } from "@/components/footer";
import { DestinationMarquee } from "@/components/circular-destinations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  Shield, 
  Clock, 
  Star, 
  ArrowRight, 
  Check, 
  Zap, 
  Map, 
  Headphones,
  Plane,
  Hotel,
  Navigation as NavIcon,
  Wine,
  CheckCircle2,
  Palmtree,
  Ticket,
  FileCheck,
  Smartphone,
  Gift
} from "lucide-react";

const HERO_VIDEOS = [
  "/hero-beach.jpeg",
  "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1600&q=80", // Luxury Resort
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80", // Villa
];

import { 
  MarriottIcon, 
  EmiratesIcon, 
  TajIcon, 
  HyattIcon, 
  QatarIcon, 
  FourSeasonsIcon, 
  VisaIcon, 
  AmexIcon,
  FacebookIcon,
  InstagramIcon,
  XIcon,
  LinkedinIcon
} from "@/components/brand-icons";

const TRUST_LOGOS = [
  { name: "Marriott",     Icon: MarriottIcon,    height: "h-7" },
  { name: "Emirates",     Icon: EmiratesIcon,    height: "h-8" },
  { name: "Taj",          Icon: TajIcon,         height: "h-7" },
  { name: "Hyatt",        Icon: HyattIcon,       height: "h-7" },
  { name: "Qatar",        Icon: QatarIcon,       height: "h-6" },
  { name: "Four Seasons", Icon: FourSeasonsIcon, height: "h-7" },
  { name: "Visa",         Icon: VisaIcon,        height: "h-6" },
  { name: "Amex",         Icon: AmexIcon,        height: "h-6" },
];

const VALUE_CARDS = [
  {
    icon: Zap,
    title: "AI Itinerary in 30 Seconds",
    desc: "Complex multi-city journeys generated with surgical precision, accounting for your unique travel DNA.",
  },
  {
    icon: Headphones,
    title: "Concierge Monitored 24/7",
    desc: "A global network of human experts watching your flight, transfer, and check-in status in real-time.",
  },
  {
    icon: Star,
    title: "VIP Hotel Upgrades",
    desc: "Automatic room upgrades, late check-outs, and property credits at 1,500+ luxury partners.",
  },
  {
    icon: NavIcon,
    title: "Instant Rerouting",
    desc: "Disruption? We've already secured your new business class seat before the gate agent even makes an announcement.",
  },
];

const DESTINATIONS = [
  { name: "Maldives",     region: "Indian Ocean", tag: "Overwater", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80" },
  { name: "Kyoto",        region: "Japan",        tag: "Culture",   img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80" },
  { name: "Amalfi Coast", region: "Italy",        tag: "Coastal",   img: "https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=600&q=80" },
  { name: "Santorini",    region: "Greece",       tag: "Islands",   img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80" },
  { name: "Paris",        region: "France",       tag: "Palaces",   img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80" },
];

export default function HomePage() {
  const [currentBg, setCurrentBg] = useState(0);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % HERO_VIDEOS.length);
    }, 8000);

    const handleScroll = () => {
      setShowSticky(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-[#0A0B10] selection:bg-[#C5A572] selection:text-white">
      <Navigation transparent />

      {/* ── STICKY SEARCH NAV ── */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="fixed top-0 left-0 right-0 z-[100] bg-[#FAF7F2] border-b border-[#7A6A5815] shadow-lg backdrop-blur-md"
          >
            <div className="max-w-7xl mx-auto h-16 flex items-center overflow-x-auto scrollbar-hide gap-0 md:gap-8 px-2 md:px-6 justify-start md:justify-center">
              <div className="flex items-center gap-2 px-3 py-2 text-[#6B1F2A] font-bold text-[10px] md:text-[11px] uppercase tracking-wider shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A572]" />
                Ask Odin AI
              </div>
              <div className="flex items-center gap-2 px-3 py-2 text-[#8C8782] font-bold text-[10px] md:text-[11px] uppercase tracking-wider shrink-0">
                <Plane className="w-3.5 h-3.5" />
                Flights
              </div>
              <div className="flex items-center gap-2 px-3 py-2 text-[#8C8782] font-bold text-[10px] md:text-[11px] uppercase tracking-wider shrink-0">
                <Hotel className="w-3.5 h-3.5" />
                Hotels
              </div>
              <div className="flex items-center gap-2 px-3 py-2 text-[#8C8782] font-bold text-[10px] md:text-[11px] uppercase tracking-wider shrink-0">
                <Palmtree className="w-3.5 h-3.5" />
                Holidays
              </div>
              <div className="flex items-center gap-2 px-3 py-2 text-[#8C8782] font-bold text-[10px] md:text-[11px] uppercase tracking-wider shrink-0">
                <Ticket className="w-3.5 h-3.5" />
                Experiences
              </div>
              <div className="flex items-center gap-2 px-3 py-2 text-[#8C8782] font-bold text-[10px] md:text-[11px] uppercase tracking-wider shrink-0">
                <FileCheck className="w-3.5 h-3.5" />
                Visa Support
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        {/* Cinematic Background Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentBg}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img 
                src={HERO_VIDEOS[currentBg]} 
                className="w-full h-full object-cover" 
                alt="Luxury background"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B10]/80 via-[#0A0B10]/40 to-[#0A0B10]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-8">
              <Badge className="bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20 px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.4em] font-extrabold shadow-sm">
                Private AI Concierge
              </Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl md:text-7xl font-semibold text-white leading-[1.1] tracking-[0.02em] mb-8">
              Luxury Travel, Globally Curated.<br />
              <span className="text-[#C5A059]">Seamlessly Delivered.</span>
            </h1>
          </motion.div>

          {/* AI Search Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-full"
          >
            <SearchWidget />
          </motion.div>
        </div>

        {/* Floating Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-4 md:gap-12 text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold w-full px-6"
        >
          <span className="flex items-center gap-2 hover:text-[#C5A572] transition-colors cursor-default whitespace-nowrap"><Shield className="w-3 h-3 shrink-0" /> No Booking Fees</span>
          <span className="flex items-center gap-2 hover:text-[#C5A572] transition-colors cursor-default whitespace-nowrap"><Zap className="w-3 h-3 shrink-0" /> Real-time Intel</span>
          <span className="flex items-center gap-2 hover:text-[#C5A572] transition-colors cursor-default whitespace-nowrap"><Check className="w-3 h-3 shrink-0" /> Verified Partners</span>
        </motion.div>
      </section>

      {/* ── LUXURY ALLIANCE RIBBON (TRUST STRIP) ── */}
      <section className="bg-[#FAF7F2] py-24 px-6 border-y border-[#7A6A5810]">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-[12px] tracking-[0.45em] font-semibold text-[#8B1A24] uppercase mb-14">
            Trusted by Global Luxury Partners
          </h2>
          
          <div className="max-w-5xl w-full overflow-hidden relative">
            <div className="rounded-full border border-[#f0e6d2] bg-white/40 py-10 shadow-[0_20px_50px_rgba(122,106,88,0.08)] backdrop-blur-md relative z-10">
              <div className="flex items-center overflow-hidden">
                <motion.div 
                  className="flex items-center gap-16 px-8 shrink-0"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ 
                    duration: 40, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                >
                  {[...TRUST_LOGOS, ...TRUST_LOGOS].map((logo, index) => (
                    <div key={`${logo.name}-${index}`} className="flex items-center gap-16 shrink-0">
                      <logo.Icon 
                        className={cn(
                          logo.height,
                          "w-auto text-[#7A6A58] opacity-100 cursor-default"
                        )} 
                      />
                      <div className="w-px h-5 bg-[#7A6A58]/10 shrink-0" />
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
            {/* Soft Edge Fade Fades */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FAF7F2] to-transparent z-20 pointer-events-none rounded-l-full" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FAF7F2] to-transparent z-20 pointer-events-none rounded-r-full" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 flex items-center justify-center text-center gap-3 text-sm md:text-[18px] font-semibold tracking-[0.04em] md:tracking-[0.08em] text-[#7A2230] uppercase w-full px-4"
          >
            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-[#7A2230] stroke-[1.5px] shrink-0" />
            <span>1,400+ Verified Suppliers Across 62 Countries</span>
          </motion.div>
        </div>
      </section>






      {/* ── DESTINATIONS MARQUEE ── */}
      <section id="destinations" className="py-32 bg-white border-t border-stone-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0A0B10] mb-4">The World. Within reach.</h2>
            <p className="text-[#8C8782] text-lg font-light">Hand-selected luxury destinations curated by our travel intelligence engine.</p>
          </div>
          <Link href="/destinations">
            <Button variant="ghost" className="text-[#6B1F2A] font-bold text-[11px] uppercase tracking-widest gap-2 hover:gap-4 transition-all group px-0">
              Explore All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        <DestinationMarquee items={DESTINATIONS} />
      </section>



      {/* ── APP DOWNLOAD SECTION ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-[#FAF7F2] rounded-2xl p-8 md:p-12 border border-[#E5E1DA] overflow-hidden shadow-sm">
            {/* Background Decorative Gold Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 blur-[100px] -mr-32 -mt-32" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E5E1DA]">
                    <Smartphone className="w-8 h-8 text-[#C5A059]" />
                  </div>
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E5E1DA]">
                    <Gift className="w-8 h-8 text-[#6B1F2A]" />
                  </div>
                </div>
                
                <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                  Download Aeronix App Now
                </h2>
                <p className="text-[#8C8782] text-sm md:text-base max-w-lg mb-8 leading-relaxed">
                  Use code <span className="font-bold text-[#6B1F2A]">AERONIX25</span> and get <span className="font-bold text-[#C5A059]">FLAT 25% OFF*</span> on your first global concierge booking.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                  <div className="flex-1 flex items-center bg-white border border-[#E5E1DA] rounded-lg px-4 h-14 group focus-within:ring-1 focus-within:ring-[#C5A059]/30 transition-all">
                    <span className="text-sm font-bold text-[#8C8782] border-r border-[#E5E1DA] pr-3 mr-3">+91</span>
                    <input 
                      type="tel" 
                      placeholder="Enter mobile number" 
                      className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder-[#8C8782]/40"
                    />
                  </div>
                  <Button className="bg-[#6B1F2A] hover:bg-[#8B2A38] text-white px-8 h-14 rounded-lg font-bold uppercase tracking-wider text-[10px] shadow-lg transition-all">
                    Get App Link
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-8 lg:gap-12 pl-0 lg:pl-12 lg:border-l border-[#E5E1DA]/50">
                <div className="flex flex-col gap-4">
                  <Link href="#" className="transition-transform hover:scale-105">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-12 w-auto" />
                  </Link>
                  <Link href="#" className="transition-transform hover:scale-105">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-12 w-auto" />
                  </Link>
                </div>
                
                <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl border border-[#E5E1DA] shadow-sm">
                  <div className="w-24 h-24 bg-white rounded flex items-center justify-center p-0 overflow-hidden">
                    <img 
                      src="/qr-code.png" 
                      alt="Scan to download Aeronix App" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback in case image is missing
                        (e.target as any).src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://aeronixholidays.com/app";
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#8C8782] uppercase tracking-widest">Scan to Download</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
