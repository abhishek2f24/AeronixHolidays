import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SearchWidget } from "@/components/search-widget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Calendar, Users, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const DESTINATIONS = {
  bali: {
    name: "Bali", country: "Indonesia", tagline: "The Island of the Gods",
    description: "Experience the ultimate blend of spiritual serenity and tropical luxury. From the emerald rice terraces of Ubud to the pristine private beaches of Nusa Dua, Bali offers a journey that transcends the ordinary.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=2000",
    highlights: ["Private Villa Retreats", "Spiritual Wellness Journeys", "Bespoke Cultural Tours"],
    price: "₹85,000",
    bestTime: "Apr – Oct (dry season)",
  },
  paris: {
    name: "Paris", country: "France", tagline: "The City of Light",
    description: "Rediscover romance in the world's most elegant capital. Experience curated access to the Louvre, private dinner cruises on the Seine, and stays in the most historic Palace hotels of the Rive Droite.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=2000",
    highlights: ["Michelin-Starred Dining", "VIP Fashion Experiences", "Historic Palace Stays"],
    price: "₹1,45,000",
    bestTime: "Apr – Jun, Sep – Oct",
  },
  maldives: {
    name: "Maldives", country: "Republic of Maldives", tagline: "Paradise Reimagined",
    description: "Escape to a world of absolute seclusion. Our Maldives collections feature only the most exclusive overwater observatories and island retreats, accessible only by private seaplane.",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=2000",
    highlights: ["Overwater Observatory Villas", "Private Island Dining", "Elite Scuba Expeditions"],
    price: "₹2,10,000",
    bestTime: "Nov – Apr (dry season)",
  },
  kyoto: {
    name: "Kyoto", country: "Japan", tagline: "The Soul of Ancient Japan",
    description: "Immerse yourself in the delicate beauty of traditional Japan. From private tea ceremonies with master practitioners to exclusive stays in high-concept Ryokans, Kyoto offers a profound connection to heritage.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=2000",
    highlights: ["Private Temple Access", "Geisha District Journeys", "Artisanal Craft Workshops"],
    price: "₹1,25,000",
    bestTime: "Mar – May (cherry blossom), Oct – Nov",
  },
  "amalfi-coast": {
    name: "Amalfi Coast", country: "Italy", tagline: "The Divine Coast",
    description: "Experience the vertical splendor of Italy's most dramatic coastline. Sail the azure waters on a private yacht, dine in lemon-scented terraces, and stay in legendary cliffside villas in Positano and Ravello.",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=2000",
    highlights: ["Private Yacht Charters", "Vintage Car Coast Drives", "Cliffside Michelin Dining"],
    price: "₹1,85,000",
    bestTime: "May – Sep",
  },
  santorini: {
    name: "Santorini", country: "Greece", tagline: "The Aegean Dream",
    description: "Witness the world's most breathtaking sunsets from the white-washed heights of Oia. Our Santorini collection features exclusive caldera-view suites with private infinity pools and bespoke volcanic wine tours.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2000",
    highlights: ["Caldera Infinity Suites", "Private Catamaran Cruises", "Volcanic Vineyard Tours"],
    price: "₹1,10,000",
    bestTime: "Jun – Sep",
  },
  dubai: {
    name: "Dubai", country: "UAE", tagline: "City of Tomorrow",
    description: "Discover a desert metropolis where everything is possible. Experience elite skydiving over the Palm, private desert safaris under the stars, and stays in the world's only seven-star hospitality landmarks.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000",
    highlights: ["Helicopter City Tours", "Private Desert Majlis", "Luxury Yacht Parties"],
    price: "₹95,000",
    bestTime: "Oct – Apr (cooler weather)",
  },
  london: {
    name: "London", country: "United Kingdom", tagline: "The Global Capital",
    description: "Experience London through an aristocratic lens. From VIP access to the Crown Jewels to private shopping in Savile Row and stays in historic Mayfair mansions, we redefine British elegance.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=2000",
    highlights: ["Private Museum Access", "Mayfair Mansion Stays", "Elite Sporting Events"],
    price: "₹1,30,000",
    bestTime: "May – Sep",
  },
};

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dest = DESTINATIONS[slug as keyof typeof DESTINATIONS];
  if (!dest) notFound();

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-end">
        <div className="absolute inset-0 z-0">
          <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080A0F] via-[#080A0F]/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
          <Badge className="bg-[#C5A572] text-white border-transparent mb-4 px-4 py-1 text-xs uppercase tracking-[0.2em] font-bold">
            Featured Destination
          </Badge>
          <h1 className="font-display text-5xl md:text-8xl font-bold text-white mb-4">{dest.name}</h1>
          <p className="font-display italic text-2xl md:text-3xl text-[#C5A572] mb-8">{dest.tagline}</p>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="w-5 h-5 text-[#C5A572]" />
              <span className="text-sm font-medium">{dest.country}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <ShieldCheck className="w-5 h-5 text-[#C5A572]" />
              <span className="text-sm font-medium">Aeronix Verified Luxury</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-display text-4xl font-bold text-ink mb-8 leading-tight">
            Elevate your journey to {dest.name}
          </h2>
          <p className="text-stone text-lg leading-relaxed mb-12">{dest.description}</p>

          <div className="grid md:grid-cols-3 gap-8">
            {dest.highlights.map((h) => (
              <div key={h} className="group">
                <div className="w-12 h-12 bg-oxblood/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-oxblood group-hover:text-white transition-all duration-300">
                  <Star className="w-5 h-5" />
                </div>
                <h4 className="font-display text-sm font-bold text-ink uppercase tracking-wider mb-2">{h}</h4>
                <p className="text-stone text-xs leading-relaxed">Hand-curated by our global concierge team for absolute excellence.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white border border-stone/10 rounded-3xl p-8 sticky top-32 shadow-xl shadow-stone/5">
            <h3 className="font-display text-2xl font-bold text-ink mb-6">Plan your {dest.name} Escape</h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-cream rounded-2xl">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-oxblood" />
                  <span className="text-sm font-medium text-ink">Best time to visit</span>
                </div>
                <span className="text-sm text-stone font-semibold">{dest.bestTime}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-cream rounded-2xl">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-oxblood" />
                  <span className="text-sm font-medium text-ink">Package Starts from</span>
                </div>
                <span className="text-sm text-oxblood font-bold">{dest.price}</span>
              </div>
            </div>

            <div className="mb-8">
              <SearchWidget />
            </div>

            <Link href="/concierge">
              <Button className="w-full bg-oxblood hover:bg-oxblood/90 text-white rounded-2xl py-7 text-base font-bold shadow-lg shadow-oxblood/20 group">
                Speak with a Concierge <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-center text-stone text-[10px] mt-4 uppercase tracking-widest font-bold">
              No Booking Fees · 24/7 Global Support
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
