import { getPackages } from "@/lib/packages";
import { SEED_PACKAGES } from "@/lib/seed-packages";
import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function PackagesPage({ searchParams }: { searchParams: Promise<{ destination?: string; category?: string }> }) {
  const sp = await searchParams;
  const dbPackages = await getPackages({ destination: sp.destination, category: sp.category });
  // Fall back to curated seed packages when DB is empty
  const packages = dbPackages.length > 0 ? dbPackages : SEED_PACKAGES;

  return (
    <div className="bg-[#F8F5F2] min-h-screen">
      <Navigation />
      
      <main className="max-w-7xl mx-auto pt-32 pb-24 px-6">
        <div className="mb-16">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-[#0A0B10] mb-4">
            Curated <span className="text-[#C5A572]">Journeys</span>
          </h1>
          <p className="text-[#8C8782] text-lg font-light max-w-2xl">
            Explore our hand-picked collection of luxury experiences. From private island escapes to cultural deep-dives.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <div 
                key={pkg.id}
                className="group bg-white rounded-[32px] overflow-hidden border border-[#E5E1DA] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image & Price Overlay */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={pkg.images[0] || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80"} 
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-md text-[#6B1F2A] border-transparent font-bold">
                      {pkg.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-[#6B1F2A] text-white px-4 py-2 rounded-xl shadow-lg">
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">Starting from</p>
                    <p className="text-xl font-bold">₹{Number(pkg.price_inr).toLocaleString("en-IN")}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-8">
                  <div className="flex items-center gap-4 text-[#8C8782] text-xs font-bold uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#C5A572]" /> {pkg.duration_days} Days</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#C5A572]" /> {pkg.destination}</span>
                  </div>
                  
                  <h3 className="font-display text-2xl font-bold text-[#1A1A1A] mb-4 group-hover:text-[#6B1F2A] transition-colors line-clamp-1">
                    {pkg.title}
                  </h3>

                  <div className="space-y-3 mb-8">
                    {pkg.inclusions.slice(0, 3).map((inc) => (
                      <div key={inc} className="flex items-center gap-2 text-xs text-[#8C8782]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A572]" />
                        {inc}
                      </div>
                    ))}
                  </div>

                  <Link href={`/packages/${pkg.slug}`}>
                    <Button className="w-full bg-[#F8F5F2] hover:bg-[#6B1F2A] text-[#6B1F2A] hover:text-white border border-[#E5E1DA] rounded-xl h-12 font-bold uppercase tracking-widest text-[10px] transition-all">
                      View Itinerary
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Palmtree className="w-10 h-10 text-[#C5A572]/20" />
              </div>
              <h3 className="text-2xl font-display font-bold text-[#1A1A1A] mb-2">No packages live yet</h3>
              <p className="text-[#8C8782]">Our curators are currently finalizing the next collection of journeys.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Palmtree(props: any) {
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
      <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4l1-1 1 1h2Z" />
      <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1 1-1-1h-3l-1 1-1-1h-2Z" />
      <path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.71.71-4.25 4.24c1.96 1.95 5.28 1.8 7.43-.35l-7.78-7.78Z" />
      <path d="M11 15.5c.5 2.5-.17 4.5-1 6.5" />
      <path d="M13 17.5c.5 2.5-.17 4.5-1 6.5" />
      <path d="M15.5 15c.5 2.5-.17 4.5-1 6.5" />
    </svg>
  );
}
