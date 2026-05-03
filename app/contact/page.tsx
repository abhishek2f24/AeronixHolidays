"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    toast.success("Message received. Our concierge will contact you shortly.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div className="space-y-12">
              <div>
                <h1 className="font-display text-4xl md:text-6xl text-ink mb-6">Contact Us</h1>
                <p className="text-xl text-stone leading-relaxed">
                  Have a complex itinerary or a special request? Our concierge team is ready to assist you.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl border border-stone/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-oxblood" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink uppercase tracking-widest text-[10px] mb-1">Corporate Office</h3>
                    <p className="text-stone">Vadodara, Gujarat, India</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl border border-stone/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-oxblood" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink uppercase tracking-widest text-[10px] mb-1">24/7 Support</h3>
                    <p className="text-stone">+91 90000 00000</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl border border-stone/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-oxblood" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink uppercase tracking-widest text-[10px] mb-1">Email</h3>
                    <p className="text-stone">concierge@aeronixholidays.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl border border-stone/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-oxblood" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink uppercase tracking-widest text-[10px] mb-1">Operating Hours</h3>
                    <p className="text-stone">Open 24 hours, 7 days a week</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 md:p-12 rounded-[40px] border border-stone/10 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required className="h-12 rounded-xl bg-[#FAF7F2] border-stone/15" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required className="h-12 rounded-xl bg-[#FAF7F2] border-stone/15" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone">Mobile Number</Label>
                  <Input id="mobile" placeholder="+91 00000 00000" required className="h-12 rounded-xl bg-[#FAF7F2] border-stone/15" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="query" className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone">Your Query</Label>
                  <textarea 
                    id="query" 
                    required 
                    rows={4} 
                    placeholder="Tell us about your travel plans..." 
                    className="w-full bg-[#FAF7F2] border border-stone/15 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-oxblood/20 transition-all"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-oxblood text-white h-14 rounded-xl font-bold uppercase tracking-[0.2em] text-xs shadow-lg hover:bg-oxblood/90 transition-all"
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
