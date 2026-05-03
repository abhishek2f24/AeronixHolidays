import { getPackageBySlug } from "@/lib/packages";
import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { PackageBookingSidebar } from "@/components/package-booking-sidebar";
import { Clock, MapPin, CheckCircle2, XCircle, Users, Plane, Hotel, Camera } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  return (
    <div className="bg-[#F8F5F2] min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={pkg.images[0] || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1600&q=80"}
            className="w-full h-full object-cover" alt={pkg.title}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <Badge className="bg-[#C5A572] text-white border-none mb-6 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold">
            {pkg.category} Experience
          </Badge>
          <h1 className="font-display text-4xl md:text-7xl font-bold text-white max-w-4xl mb-6">{pkg.title}</h1>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-white/80 text-xs font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#C5A572]" /> {pkg.duration_days} Days</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#C5A572]" /> {pkg.destination}</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-[#C5A572]" /> Max {pkg.max_pax} Pax</span>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-16">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-16">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Plane,        label: "Flights",  value: "Included"  },
                { icon: Hotel,        label: "Stay",     value: "Luxury 5★" },
                { icon: CheckCircle2, label: "Visa",     value: "Assisted"  },
                { icon: Camera,       label: "Tours",    value: "Private"   },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="p-6 bg-white rounded-2xl border border-[#E5E1DA] text-center">
                  <Icon className="w-6 h-6 text-[#C5A572] mx-auto mb-3" />
                  <p className="text-[10px] font-bold text-[#8C8782] uppercase tracking-tighter">{label}</p>
                  <p className="text-xs font-bold text-[#1A1A1A]">{value}</p>
                </div>
              ))}
            </div>

            {/* Itinerary */}
            <div>
              <h2 className="font-display text-3xl font-bold text-[#1A1A1A] mb-8">Daily Itinerary</h2>
              <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#E5E1DA]">
                {pkg.itinerary.map((day) => (
                  <div key={day.day} className="relative pl-12">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-white border border-[#E5E1DA] flex items-center justify-center z-10">
                      <span className="text-[10px] font-bold text-[#C5A572]">{day.day}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#1A1A1A] mb-3">{day.title}</h3>
                    <ul className="space-y-2">
                      {day.activities.map((act, i) => (
                        <li key={i} className="text-[#8C8782] text-sm font-light leading-relaxed flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-[#C5A572] shrink-0" />{act}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions / Exclusions */}
            <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-[#E5E1DA]">
              <div>
                <h3 className="font-bold text-[#1A1A1A] mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" /> What&apos;s Included
                </h3>
                <ul className="space-y-4">
                  {pkg.inclusions.map((inc) => (
                    <li key={inc} className="text-[#8C8782] text-sm flex items-start gap-3">
                      <CheckIcon className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{inc}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A1A] mb-6 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" /> What&apos;s Not Included
                </h3>
                <ul className="space-y-4">
                  {pkg.exclusions.map((exc) => (
                    <li key={exc} className="text-[#8C8782] text-sm flex items-start gap-3">
                      <CheckIcon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />{exc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Booking sidebar — client component */}
          <div className="lg:col-span-1">
            <PackageBookingSidebar
              pkgId={pkg.id}
              pkgTitle={pkg.title}
              priceInr={Number(pkg.price_inr)}
              originalPriceInr={pkg.original_price_inr ? Number(pkg.original_price_inr) : undefined}
              maxPax={pkg.max_pax}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
