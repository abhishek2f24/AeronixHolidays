import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function RefundsPage() {
  return (
    <div className="bg-cream min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto pt-32 pb-24 px-6">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-8">Refunds & Cancellation</h1>
        
        <div className="prose prose-stone max-w-none space-y-8 text-stone">
          <section>
            <h2 className="text-xl font-bold text-ink mb-4">1. Flight Cancellations</h2>
            <p>
              Cancellation policies for flight bookings are determined by the respective airlines. In addition to the airline's cancellation fee, Aeronix Holidays may charge a nominal service fee of ₹250 per passenger for processing the cancellation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">2. Hotel Cancellations</h2>
            <p>
              Hotel cancellation policies vary by property and room type. Many luxury properties have a "No Refund" policy for discounted rates, while others offer free cancellation up to 48 hours before check-in. Please review the specific policy shown at the time of booking.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">3. Refund Processing</h2>
            <p>
              Once a refund request is initiated and approved by the service provider (airline/hotel), it typically takes 7-10 working days for the amount to reflect in your original payment method.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">4. Convenience Fees</h2>
            <p>
              The convenience fee charged at the time of booking is non-refundable in the event of cancellation by the traveler.
            </p>
          </section>

          <section className="bg-[#6B1F2A]/5 p-6 rounded-2xl border border-[#6B1F2A]/10 mt-12">
            <h2 className="text-lg font-bold text-ink mb-2">Need Help?</h2>
            <p className="text-sm">
              If you need to cancel a booking or track a refund, please contact our 24/7 concierge support.
            </p>
            <p className="mt-4 text-sm font-medium">
              Email: support@aeronixholidays.com<br />
              WhatsApp: +91 99999 99999
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
