import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Hotel, Briefcase, Globe, BarChart3 } from "lucide-react";

export default function PartnersPage() {
  const partners = [
    {
      icon: Hotel,
      title: "Hotel Partners",
      desc: "Integrate your luxury property directly into our AI engine. We prioritize direct partnerships with boutique hotels and global chains to offer our members exclusive upgrades."
    },
    {
      icon: Briefcase,
      title: "Corporate Accounts",
      desc: "Streamline executive travel with our dedicated B2B portal. Manage team bookings, track expenses, and ensure traveler safety with 24/7 concierge monitoring."
    },
    {
      icon: Globe,
      title: "Travel Affiliates",
      desc: "Join our elite network of luxury influencers and travel advisors. Earn industry-leading commissions while providing your clients with AI-driven precision."
    },
    {
      icon: BarChart3,
      title: "Tourism Boards",
      desc: "Promote your destination to a high-intent, premium audience. Use our data insights to understand travel patterns and optimize your luxury tourism strategy."
    }
  ];

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="font-display text-4xl md:text-6xl text-ink mb-6">Partner With Aeronix</h1>
          <p className="text-xl text-stone">Scale the future of luxury travel together.</p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {partners.map((partner, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[32px] border border-stone/10 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-oxblood/5 rounded-2xl flex items-center justify-center mb-6">
                <partner.icon className="w-6 h-6 text-oxblood" />
              </div>
              <h3 className="text-xl font-display text-ink mb-3">{partner.title}</h3>
              <p className="text-stone leading-relaxed">{partner.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-20 p-12 bg-ink text-white rounded-[40px] text-center shadow-2xl">
          <h2 className="text-3xl font-display mb-4">Start a Partnership</h2>
          <p className="text-white/60 mb-8">Send us an enquiry and our business development team will get back to you within 48 hours.</p>
          <a href="/contact" className="inline-block bg-[#C5A059] text-ink px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#D5B069] transition-all">
            Get in Touch
          </a>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
