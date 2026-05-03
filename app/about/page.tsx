import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl text-ink mb-8">About Aeronix Holidays</h1>
          
          <div className="prose prose-lg prose-stone max-w-none space-y-6 text-stone">
            <p className="text-xl font-medium text-oxblood">
              Redefining luxury travel through the lens of artificial intelligence and human expertise.
            </p>
            
            <p>
              Aeronix Holidays was founded with a single mission: to eliminate the friction from luxury travel planning. In a world of infinite choices, we provide precision.
            </p>
            
            <h2 className="text-2xl font-display text-ink mt-12">Our Story</h2>
            <p>
              Incorporated in **Vadodara, Gujarat**, Aeronix Holidays emerged as a response to the traditional, slow-moving travel industry. We combined state-of-the-art AI technology—Odin—with an elite network of global concierges to deliver travel experiences that are not just booked, but engineered for perfection.
            </p>

            <h2 className="text-2xl font-display text-ink mt-12">The Aeronix Difference</h2>
            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div className="bg-white p-6 rounded-2xl border border-stone/10 shadow-sm">
                <h3 className="font-bold text-oxblood mb-2 uppercase tracking-widest text-xs">AI Intelligence</h3>
                <p className="text-sm">Our Odin AI processes millions of data points to find the perfect flight routes and hotel combinations tailored to your preferences.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-stone/10 shadow-sm">
                <h3 className="font-bold text-oxblood mb-2 uppercase tracking-widest text-xs">Human Touch</h3>
                <p className="text-sm">Every plan is verified and monitored by a professional travel concierge, ensuring seamless delivery on the ground.</p>
              </div>
            </div>

            <p>
              Whether it's a private jet charter to the Maldives or a cultural deep-dive in Kyoto, Aeronix ensures that every detail—from visa processing to airport transfers—is handled with surgical precision.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
