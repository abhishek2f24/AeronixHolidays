import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Wifi, Coffee, Car, Shield, Wind, Tv, Check, Share2, Heart } from "lucide-react";
import Image from "next/image";

// Mock hotel data
const HOTEL = {
  id: "h1",
  name: "Waldorf Astoria Maldives Ithaafushi",
  location: "South Male Atoll, Maldives",
  rating: 5,
  reviews: 482,
  price: 185000,
  description: "Experience the pinnacle of Maldivian luxury. Spread across three private islands, this resort offers 11 celebrated dining venues, a world-class lifestyle spa sanctuary, and exquisite overwater villas each with its own private pool.",
  amenities: [
    { icon: Wifi, label: "Free Ultra-fast WiFi" },
    { icon: Coffee, label: "11 Signature Restaurants" },
    { icon: Car, label: "Private Yacht Transfer" },
    { icon: Shield, label: "24/7 Personal Concierge" },
    { icon: Wind, label: "Full-service Spa" },
    { icon: Tv, label: "Apple TV & Sound System" },
  ],
  images: [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2049&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
  ],
  highlights: [
    "Private infinity pool in every villa",
    "Underwater dining experience",
    "Exclusive reef exploration",
    "Sustainable luxury practices",
  ]
};

export default function HotelDetailPage() {
  return (
    <div className="bg-cream min-h-screen">
      <Navigation />
      
      <main className="max-w-7xl mx-auto pt-24 pb-24 px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-amber-400">
                {[...Array(HOTEL.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-xs font-bold text-stone tracking-widest uppercase">{HOTEL.reviews} Verified Reviews</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-ink">{HOTEL.name}</h1>
            <div className="flex items-center gap-1 text-stone mt-2">
              <MapPin className="w-4 h-4 text-oxblood" />
              <span className="text-sm">{HOTEL.location}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl border-stone-200 hover:bg-stone-50">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button variant="outline" className="rounded-xl border-stone-200 hover:bg-stone-50">
              <Heart className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] mb-12 rounded-3xl overflow-hidden shadow-2xl">
          <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer">
            <Image src={HOTEL.images[0]} alt="Main" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          </div>
          <div className="relative group cursor-pointer">
            <Image src={HOTEL.images[1]} alt="Gallery 2" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="relative group cursor-pointer">
            <Image src={HOTEL.images[2]} alt="Gallery 3" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="md:col-span-2 relative group cursor-pointer">
            <Image src={HOTEL.images[3]} alt="Gallery 4" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-bold tracking-widest uppercase text-sm">View All Photos</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">About this property</h2>
              <p className="text-stone leading-relaxed text-lg">{HOTEL.description}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink mb-6">Premium Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {HOTEL.amenities.map((item, i) => (
                  <div key={i} className="flex flex-col gap-3 p-6 rounded-2xl bg-white border border-stone-100 shadow-sm">
                    <item.icon className="w-6 h-6 text-oxblood" />
                    <span className="text-sm font-bold text-ink uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink mb-6">Experience Highlights</h2>
              <div className="space-y-4">
                {HOTEL.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-4 text-stone">
                    <div className="w-6 h-6 rounded-full bg-oxblood/10 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-oxblood" />
                    </div>
                    <span className="text-lg">{h}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

import { WeatherWidget } from "@/components/weather-widget";

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Booking Card */}
            <div className="sticky top-32 space-y-6">
              <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl p-8 space-y-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-stone uppercase tracking-widest">Starting from</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-oxblood">₹{HOTEL.price.toLocaleString("en-IN")}</span>
                    <p className="text-xs text-stone">per night · taxes included</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-stone uppercase tracking-widest">Check-in</p>
                      <p className="text-sm font-bold text-ink">14 Jun 2026</p>
                    </div>
                    <div className="space-y-1 border-l border-stone-200 pl-4">
                      <p className="text-[10px] font-bold text-stone uppercase tracking-widest">Check-out</p>
                      <p className="text-sm font-bold text-ink">21 Jun 2026</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <p className="text-[10px] font-bold text-stone uppercase tracking-widest">Guests</p>
                    <p className="text-sm font-bold text-ink">2 Adults · 1 Room</p>
                  </div>
                </div>

                <Button className="w-full bg-oxblood hover:bg-oxblood/90 text-white h-14 rounded-xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-oxblood/20 transition-all">
                  Check Availability
                </Button>
                
                <p className="text-center text-[10px] text-stone uppercase tracking-widest">
                  Protected by Aeronix Booking Guarantee
                </p>
              </div>

              <WeatherWidget location={HOTEL.location} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
