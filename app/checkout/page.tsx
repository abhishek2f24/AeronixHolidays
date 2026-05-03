"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  User, Plane, Hotel, CreditCard, ShieldCheck, 
  Info, ChevronRight, Tag, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();
  const type = params.get("type") || "flight";
  const adults = Number(params.get("adults") || 1);
  
  const [step, setStep] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const [travellers, setTravellers] = useState(
    Array.from({ length: adults }).map(() => ({
      firstName: "",
      lastName: "",
      gender: "male",
      passportNumber: "",
      nationality: "Indian",
    }))
  );

  const price = type === "flight" ? 42500 : 185000;
  const taxes = Math.round(price * 0.12);
  const discount = appliedPromo ? 5000 : 0;
  const total = (price * adults) + taxes - discount;

  const handleNextStep = () => {
    if (step === 1) {
      if (travellers.some(t => !t.firstName || !t.lastName)) {
        toast.error("Please fill in all traveller names.");
        return;
      }
      setStep(2);
      window.scrollTo(0, 0);
    } else {
      handlePayment();
    }
  };

  const handlePayment = () => {
    toast.loading("Initiating secure payment...");
    // Simulate Razorpay integration
    setTimeout(() => {
      toast.dismiss();
      toast.success("Payment successful! Redirecting to your itinerary...");
      router.push("/trips/confirmation?id=AX-" + Math.random().toString(36).substring(7).toUpperCase());
    }, 2000);
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "AERONIX10") {
      setAppliedPromo("AERONIX10");
      toast.success("Promo code applied successfully!");
    } else {
      toast.error("Invalid promo code.");
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      <Navigation />
      
      <main className="max-w-6xl mx-auto pt-32 pb-24 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm", step >= 1 ? "bg-oxblood text-white" : "bg-stone-200 text-stone")}>1</div>
              <div className="h-[2px] w-12 bg-stone-200" />
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm", step >= 2 ? "bg-oxblood text-white" : "bg-stone-200 text-stone")}>2</div>
            </div>

            {step === 1 ? (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-oxblood" />
                  <h2 className="text-2xl font-bold text-ink">Traveller Details</h2>
                </div>
                
                {travellers.map((t, i) => (
                  <div key={i} className="p-8 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-6">
                    <h3 className="text-sm font-bold text-stone uppercase tracking-widest">Traveller {i + 1} (Adult)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-stone uppercase tracking-widest">First Name</label>
                        <input 
                          type="text" 
                          value={t.firstName}
                          onChange={(e) => {
                            const n = [...travellers]; n[i].firstName = e.target.value; setTravellers(n);
                          }}
                          placeholder="As per passport" 
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 h-12 text-sm focus:ring-1 focus:ring-oxblood/20 focus:outline-none" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-stone uppercase tracking-widest">Last Name</label>
                        <input 
                          type="text" 
                          value={t.lastName}
                          onChange={(e) => {
                            const n = [...travellers]; n[i].lastName = e.target.value; setTravellers(n);
                          }}
                          placeholder="As per passport" 
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 h-12 text-sm focus:ring-1 focus:ring-oxblood/20 focus:outline-none" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-stone uppercase tracking-widest">Nationality</label>
                        <select className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 h-12 text-sm focus:ring-1 focus:ring-oxblood/20 focus:outline-none">
                          <option>Indian</option>
                          <option>American</option>
                          <option>British</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-stone uppercase tracking-widest">Passport Number</label>
                        <input type="text" placeholder="Optional for now" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 h-12 text-sm focus:ring-1 focus:ring-oxblood/20 focus:outline-none" />
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            ) : (
              <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-oxblood" />
                  <h2 className="text-2xl font-bold text-ink">Secure Payment</h2>
                </div>
                
                <div className="p-8 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-6 text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-ink">Payment via Razorpay</h3>
                  <p className="text-stone text-sm max-w-md mx-auto">
                    You will be redirected to Razorpay's secure payment gateway to complete your transaction using UPI, Card, or Netbanking.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-[10px] text-stone uppercase tracking-widest font-bold">
                    <Lock className="w-3 h-3" /> PCI DSS Compliant · SSL Encrypted
                  </div>
                </div>
              </section>
            )}

            <div className="flex justify-between items-center pt-8 border-t border-stone-200">
              <Button 
                variant="ghost" 
                onClick={() => step > 1 ? setStep(1) : router.back()}
                className="text-stone font-bold text-xs uppercase tracking-widest"
              >
                {step > 1 ? "Go Back" : "Cancel"}
              </Button>
              <Button 
                onClick={handleNextStep}
                className="bg-oxblood hover:bg-oxblood/90 text-white h-14 px-10 rounded-xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-oxblood/20"
              >
                {step === 1 ? "Proceed to Payment" : "Pay ₹" + total.toLocaleString("en-IN")} <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl p-8 space-y-6">
                <h3 className="text-sm font-bold text-ink uppercase tracking-widest flex items-center gap-2">
                  {type === "flight" ? <Plane className="w-4 h-4 text-oxblood" /> : <Hotel className="w-4 h-4 text-oxblood" />}
                  Booking Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone">{type === "flight" ? "Base Fare" : "Room Rate"} ({adults} Guest{adults > 1 ? "s" : ""})</span>
                    <span className="font-bold text-ink">₹{(price * adults).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone">Taxes & Fees</span>
                    <span className="font-bold text-ink">₹{taxes.toLocaleString("en-IN")}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-sm text-green-600 font-bold">
                      <span>Promo Discount</span>
                      <span>- ₹{discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-stone-100 flex justify-between items-end">
                    <span className="text-sm font-bold text-ink uppercase tracking-widest">Total Amount</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-oxblood">₹{total.toLocaleString("en-IN")}</p>
                      <p className="text-[10px] text-stone uppercase tracking-widest">All Inclusive</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <p className="text-[10px] font-bold text-stone uppercase tracking-widest mb-3">Promo Code</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code" 
                      className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 h-10 text-xs focus:outline-none" 
                    />
                    <Button 
                      onClick={applyPromo}
                      variant="outline" 
                      className="h-10 px-4 border-oxblood text-oxblood font-bold text-[10px] uppercase tracking-widest hover:bg-oxblood hover:text-white"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-stone-50 border border-stone-200 rounded-2xl flex gap-4">
                <ShieldCheck className="w-6 h-6 text-oxblood shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-ink uppercase tracking-widest mb-1">Aeronix Guarantee</p>
                  <p className="text-[10px] text-stone leading-relaxed">
                    100% Refundable bookings on select fares. Instant support for rescheduling. No hidden convenience fees.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
