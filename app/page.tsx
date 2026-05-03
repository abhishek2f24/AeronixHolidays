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
  "/hero-bag.jpg",
  "/hero-beach.jpeg",
  "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1600&q=80", // Luxury Resort
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
  { name: "Dubai",        region: "UAE",          tag: "Modern",    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80" },
  { name: "London",       region: "UK",           tag: "Heritage",  img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80" },
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
            <div className="max-w-7xl mx-auto h-16 flex items-center overflow-x-auto scrollbar-hide gap-0 md:gap-2 px-2 md:px-6 justify-start md:justify-center">
              {[
                { label: "Ask Odin AI", icon: Sparkles, href: "/plan",    active: true  },
                { label: "Flights",     icon: Plane,    href: "/search?type=flight" },
                { label: "Hotels",      icon: Hotel,    href: "/search?type=hotel"  },
                { label: "Holidays",    icon: Palmtree, href: "/packages"            },
                { label: "Experiences", icon: Ticket,   href: "/plan?q=experiences" },
                { label: "Visa Support",icon: FileCheck,href: "/plan?q=visa+support"},
              ].map(({ label, icon: Icon, href, active }) => (
                <Link key={label} href={href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-[10px] md:text-[11px] uppercase tracking-wider shrink-0 transition-colors hover:text-[#6B1F2A] hover:bg-[#6B1F2A]/5 ${active ? "text-[#6B1F2A]" : "text-[#8C8782]"}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
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



      {/* ── TRAVEL BY THEME ── */}
      <section className="py-20 px-4 md:px-6 bg-[#FAF7F2] border-t border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0A0B10] mb-3">Travel by Theme</h2>
            <p className="text-[#8C8782] text-base">Find your perfect trip style</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { label: "Honeymoon",  img: "/themes/honeymoon.png", href: "/packages?category=honeymoon" },
              { label: "Adventure",  img: "/themes/adventure.png", href: "/packages?category=adventure" },
              { label: "Family",     img: "/themes/family.png",    href: "/packages?category=family"    },
              { label: "Beach",      img: "/themes/beach.png",     href: "/packages?category=beach"     },
              { label: "Heritage",   img: "/themes/heritage.png",  href: "/packages?category=heritage"  },
              { label: "Luxury",     img: "/themes/luxury.png",    href: "/packages?category=luxury"    },
            ].map(({ label, img, href }) => (
              <Link key={label} href={href}>
                <div className="group relative rounded-2xl overflow-hidden aspect-square border border-stone-200 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
                  <img src={img} alt={label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <p className="font-bold text-white text-sm uppercase tracking-widest">{label}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING PACKAGES ── */}
      <section className="py-20 px-4 md:px-6 bg-white border-t border-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0A0B10] mb-2">Trending Holiday Packages</h2>
              <p className="text-[#8C8782] text-base">Best-selling trips, handpicked by our travel team</p>
            </div>
            <Link href="/packages">
              <Button variant="ghost" className="text-[#6B1F2A] font-bold text-xs uppercase tracking-widest gap-2">
                View All Packages <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Bali Bliss 6N/7D",          dest: "Bali, Indonesia",   price: "₹45,000",  oldPrice: "₹65,000",  tag: "Bestseller",  img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",  href: "/destinations/bali"     },
              { title: "Maldives Escape 5N/6D",      dest: "Maldives",          price: "₹1,20,000", oldPrice: "₹1,60,000", tag: "Luxury",      img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80", href: "/destinations/maldives" },
              { title: "Europe Highlights 10N",      dest: "Multi-city Europe", price: "₹1,85,000", oldPrice: "₹2,30,000", tag: "Popular",     img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80", href: "/destinations/paris"    },
              { title: "Dubai Extravaganza 5N",      dest: "Dubai, UAE",        price: "₹60,000",  oldPrice: "₹80,000",  tag: "Trending",    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",  href: "/destinations/dubai"    },
            ].map((pkg) => (
              <Link key={pkg.title} href={pkg.href}>
                <div className="group bg-white rounded-2xl border border-[#E5E1DA] overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    <img src={pkg.img} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <Badge className="absolute top-3 left-3 bg-[#6B1F2A] text-white border-transparent text-[9px] font-bold uppercase tracking-wider">{pkg.tag}</Badge>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-stone font-medium mb-1">{pkg.dest}</p>
                    <h3 className="font-bold text-[#1A1A1A] mb-2">{pkg.title}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[#6B1F2A] font-black text-lg">{pkg.price}</span>
                      <span className="text-stone text-xs line-through">{pkg.oldPrice}</span>
                    </div>
                    <p className="text-stone text-xs">per person · all inclusive</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR FLIGHT ROUTES ── */}
      <section className="py-16 px-4 md:px-6 bg-[#FAF7F2] border-t border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0A0B10] mb-2">Popular Flight Routes</h2>
              <p className="text-[#8C8782] text-sm">Lowest fares updated daily</p>
            </div>
            <Link href="/search?type=flight">
              <Button variant="ghost" className="text-[#6B1F2A] font-bold text-xs uppercase tracking-widest gap-2 shrink-0">
                All Flights <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { from: "Delhi",      to: "Dubai",     fromC: "DEL", toC: "DXB", price: "₹14,500", code: "ae" },
              { from: "Mumbai",     to: "London",    fromC: "BOM", toC: "LHR", price: "₹38,900", code: "gb" },
              { from: "Delhi",      to: "Bangkok",   fromC: "DEL", toC: "BKK", price: "₹8,200",  code: "th" },
              { from: "Bangalore",  to: "Singapore", fromC: "BLR", toC: "SIN", price: "₹11,400", code: "sg" },
              { from: "Mumbai",     to: "Paris",     fromC: "BOM", toC: "CDG", price: "₹42,000", code: "fr" },
              { from: "Delhi",      to: "Maldives",  fromC: "DEL", toC: "MLE", price: "₹18,700", code: "mv" },
            ].map(({ from, to, fromC, toC, price, code }) => (
              <Link key={`${fromC}-${toC}`} href={`/search?type=flight&from=${fromC}&to=${toC}&depart=${new Date(Date.now() + 7*86400000).toISOString().split("T")[0]}&adults=1&cabin=ECONOMY`}>
                <div className="group bg-white rounded-2xl border border-[#E5E1DA] p-5 hover:shadow-lg hover:border-[#C5A059] transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-stone-100 mb-4 shadow-sm">
                    <img 
                      src={`https://flagcdn.com/w80/${code}.png`} 
                      alt={to} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-stone font-bold mb-1">{from} →</p>
                  <p className="font-bold text-ink text-sm leading-tight">{to}</p>
                  <div className="mt-3 pt-3 border-t border-stone-50 flex items-center justify-between">
                    <p className="text-[#6B1F2A] font-black text-sm">{price}</p>
                    <ArrowRight className="w-3 h-3 text-[#6B1F2A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* ── SPECIAL OFFERS BANNER ── */}
      <section className="py-12 px-4 md:px-6 bg-gradient-to-r from-[#6B1F2A] via-[#7A2030] to-[#8B2A38]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-2">Limited Time</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
              Use code <span className="bg-white/20 px-3 py-1 rounded-lg font-mono">AERONIX10</span>
            </h2>
            <p className="text-white/60 text-sm">Get 10% off on flights, hotels & holiday packages. New users only.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/offers">
              <Button className="bg-[#C5A059] hover:bg-[#C5A059]/90 text-[#0A0B10] font-bold rounded-xl px-6 h-12 uppercase tracking-wider text-xs">
                View All Offers
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl px-6 h-12 uppercase tracking-wider text-xs">
                Book Now
              </Button>
            </Link>
          </div>
        </div>
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
