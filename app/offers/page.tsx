import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Clock, Copy, Plane, Hotel, Palmtree, ArrowRight, Zap, Shield, Percent } from "lucide-react";
import Link from "next/link";

const PROMO_CODES = [
  {
    code: "AERONIX10",
    title: "10% off your first booking",
    desc: "Valid on all flights and holiday packages. New users only.",
    discount: "10% OFF",
    expiry: "31 May 2026",
    type: "all",
    color: "from-[#6B1F2A] to-[#8B2A38]",
  },
  {
    code: "FLYSMRT500",
    title: "Flat ₹500 off on flights",
    desc: "On bookings above ₹5,000. Valid on all domestic routes.",
    discount: "₹500 OFF",
    expiry: "30 Jun 2026",
    type: "flights",
    color: "from-blue-600 to-blue-800",
  },
  {
    code: "HOTELSTAR",
    title: "₹1,000 off 5-star hotels",
    desc: "On bookings of 2 nights or more at select luxury properties.",
    discount: "₹1,000 OFF",
    expiry: "30 Jun 2026",
    type: "hotels",
    color: "from-emerald-600 to-emerald-800",
  },
  {
    code: "HOLIDAYS25",
    title: "25% off holiday packages",
    desc: "On all international packages. Min booking ₹50,000.",
    discount: "25% OFF",
    expiry: "15 Jun 2026",
    type: "packages",
    color: "from-amber-600 to-orange-700",
  },
];

const FLIGHT_DEALS = [
  { from: "Delhi",   to: "Dubai",     fromCode: "DEL", toCode: "DXB", price: "₹14,500", tag: "Direct", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80" },
  { from: "Mumbai",  to: "London",    fromCode: "BOM", toCode: "LHR", price: "₹38,900", tag: "Best value", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80" },
  { from: "Delhi",   to: "Bangkok",   fromCode: "DEL", toCode: "BKK", price: "₹8,200",  tag: "Trending",  img: "https://images.unsplash.com/photo-1563492065-7b3e7e8cae30?w=600&q=80" },
  { from: "Bangalore",to: "Singapore",fromCode: "BLR", toCode: "SIN", price: "₹11,400", tag: "Popular",   img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80" },
  { from: "Chennai", to: "Paris",     fromCode: "MAA", toCode: "CDG", price: "₹42,000", tag: "Luxury",    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80" },
  { from: "Mumbai",  to: "Maldives",  fromCode: "BOM", toCode: "MLE", price: "₹18,700", tag: "Getaway",   img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80" },
];

const HOTEL_DEALS = [
  { name: "The Leela Palace, Delhi",   city: "New Delhi",  price: "₹14,000/night", rating: 5, discount: "20% off", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80" },
  { name: "ITC Maratha, Mumbai",       city: "Mumbai",     price: "₹11,500/night", rating: 5, discount: "15% off", img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80" },
  { name: "The Oberoi Udaivilas",      city: "Udaipur",    price: "₹28,000/night", rating: 5, discount: "10% off", img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80" },
  { name: "Taj Exotica, Goa",          city: "Goa",        price: "₹9,800/night",  rating: 5, discount: "25% off", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80" },
];

const PACKAGE_DEALS = [
  { title: "Bali Escape 6N/7D",        dest: "Bali",       price: "₹45,000",  oldPrice: "₹65,000", inc: ["Flights", "5★ Hotel", "Transfers", "Breakfast"], img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80" },
  { title: "Maldives Luxury 5N/6D",    dest: "Maldives",   price: "₹1,20,000", oldPrice: "₹1,60,000", inc: ["Seaplane", "Overwater Villa", "All-inclusive"], img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80" },
  { title: "Singapore + Malaysia 7N",  dest: "Singapore",  price: "₹55,000",  oldPrice: "₹75,000", inc: ["Flights", "4★ Hotels", "City Tours", "Breakfast"], img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80" },
  { title: "Europe Highlights 10N",    dest: "Europe",     price: "₹1,85,000", oldPrice: "₹2,30,000", inc: ["Flights", "Schengen Visa", "Hotels", "Euro Rail"], img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80" },
];

function PromoCard({ promo }: { promo: typeof PROMO_CODES[0] }) {
  return (
    <div className={`relative rounded-2xl bg-gradient-to-r ${promo.color} p-6 text-white overflow-hidden`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <Badge className="bg-white/20 text-white border-transparent text-[10px] uppercase tracking-widest mb-2">
              {promo.type === "all" ? "All bookings" : promo.type}
            </Badge>
            <h3 className="font-bold text-lg leading-tight">{promo.title}</h3>
            <p className="text-white/70 text-xs mt-1">{promo.desc}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-3xl font-black">{promo.discount}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
            <span className="font-mono font-bold text-lg tracking-widest">{promo.code}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-white/60 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>Expires {promo.expiry}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OffersPage() {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-28 md:pt-32 pb-24">

        {/* Header */}
        <div className="mb-10">
          <Badge className="bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold mb-4">
            Limited Time Deals
          </Badge>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-[#0A0B10] mb-3">
            Offers & <span className="text-[#C5A059]">Deals</span>
          </h1>
          <p className="text-[#8C8782] text-base max-w-xl">
            Exclusive promo codes, cashback deals, and best-price flight & hotel offers — updated daily.
          </p>
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap gap-4 mb-10">
          {[
            { icon: Zap,     label: "Instant Booking Confirmation" },
            { icon: Shield,  label: "100% Secure Payments" },
            { icon: Percent, label: "Best Price Guarantee" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-[#E5E1DA] text-xs font-semibold text-[#1A1A1A]">
              <Icon className="w-3.5 h-3.5 text-[#C5A059]" />
              {label}
            </div>
          ))}
        </div>

        {/* ── Promo Codes ── */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-5">
            <Tag className="w-5 h-5 text-[#6B1F2A]" />
            <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">Promo Codes</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {PROMO_CODES.map((promo) => (
              <PromoCard key={promo.code} promo={promo} />
            ))}
          </div>
        </section>

        {/* ── Flight Deals ── */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-blue-600" />
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">Flight Deals</h2>
            </div>
            <Link href="/search?type=flight">
              <Button variant="ghost" className="text-[#6B1F2A] font-bold text-xs uppercase tracking-widest gap-1">
                All Flights <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {FLIGHT_DEALS.map((deal) => (
              <Link
                key={`${deal.fromCode}-${deal.toCode}`}
                href={`/search?type=flight&from=${deal.fromCode}&to=${deal.toCode}&depart=${today}&adults=1&cabin=ECONOMY`}
              >
                <div className="group bg-white rounded-2xl border border-[#E5E1DA] overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="relative h-28 overflow-hidden">
                    <img src={deal.img} alt={deal.to} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-2 left-2 bg-white/90 text-[#6B1F2A] border-transparent text-[9px] font-bold">{deal.tag}</Badge>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-stone font-medium">{deal.from} →</p>
                    <p className="font-bold text-ink text-sm">{deal.to}</p>
                    <p className="text-[#6B1F2A] font-black text-sm mt-0.5">{deal.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Hotel Deals ── */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Hotel className="w-5 h-5 text-emerald-600" />
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">Hotel Deals</h2>
            </div>
            <Link href="/search?type=hotel">
              <Button variant="ghost" className="text-[#6B1F2A] font-bold text-xs uppercase tracking-widest gap-1">
                All Hotels <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOTEL_DEALS.map((hotel) => (
              <Link
                key={hotel.name}
                href={`/search?type=hotel&destination=${encodeURIComponent(hotel.city)}&checkIn=${today}&checkOut=${today}`}
              >
                <div className="group bg-white rounded-2xl border border-[#E5E1DA] overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="relative h-36 overflow-hidden">
                    <img src={hotel.img} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <Badge className="absolute top-2 right-2 bg-[#6B1F2A] text-white border-transparent text-[9px] font-bold">{hotel.discount}</Badge>
                    <div className="absolute bottom-2 left-2 flex gap-0.5">
                      {Array.from({ length: hotel.rating }).map((_, i) => (
                        <span key={i} className="text-amber-400 text-[10px]">★</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-ink text-sm leading-tight line-clamp-1">{hotel.name}</p>
                    <p className="text-stone text-xs mt-0.5">{hotel.city}</p>
                    <p className="text-[#6B1F2A] font-black text-sm mt-1">{hotel.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Package Deals ── */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Palmtree className="w-5 h-5 text-amber-600" />
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">Holiday Package Deals</h2>
            </div>
            <Link href="/packages">
              <Button variant="ghost" className="text-[#6B1F2A] font-bold text-xs uppercase tracking-widest gap-1">
                All Packages <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PACKAGE_DEALS.map((pkg) => (
              <Link key={pkg.title} href={`/packages?destination=${encodeURIComponent(pkg.dest)}`}>
                <div className="group bg-white rounded-2xl border border-[#E5E1DA] overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="relative h-44 overflow-hidden">
                    <img src={pkg.img} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-bold text-sm leading-tight">{pkg.title}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {pkg.inc.map((i) => (
                        <span key={i} className="text-[10px] bg-[#FAF7F2] border border-[#E5E1DA] rounded-full px-2 py-0.5 text-[#8C8782] font-medium">{i}</span>
                      ))}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[#6B1F2A] font-black text-xl">{pkg.price}</span>
                      <span className="text-stone text-xs line-through">{pkg.oldPrice}</span>
                    </div>
                    <p className="text-stone text-xs mt-0.5">per person, taxes included</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Ask Odin CTA ── */}
        <section className="bg-gradient-to-r from-[#0A0B10] to-[#1A1520] rounded-3xl p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-[#C5A059]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Zap className="w-8 h-8 text-[#C5A059]" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
            Want the best deal for your trip?
          </h2>
          <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
            Ask Odin AI to find the cheapest fares, best hotels, and complete holiday packages tailored to your budget and travel style.
          </p>
          <Link href="/plan">
            <Button className="bg-[#C5A059] hover:bg-[#C5A059]/90 text-[#0A0B10] font-bold rounded-xl px-8 h-12 text-sm uppercase tracking-wider">
              Ask Odin AI <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  );
}
