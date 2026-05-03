import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="bg-cream min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto pt-32 pb-24 px-6">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-8">Privacy Policy</h1>
        
        <div className="prose prose-stone max-w-none space-y-8 text-stone">
          <p className="text-lg italic">Last Updated: May 4, 2026</p>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">1. Data Collection</h2>
            <p>
              We collect information you provide directly to us, such as when you create or modify your account, request concierge services, complete a booking, or communicate with us. This information may include:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Name, email address, phone number, and physical address.</li>
              <li>Passport details and date of birth for international bookings.</li>
              <li>Travel preferences and "Travel DNA" for personalization.</li>
              <li>Payment information (tokenized via our payment partners).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">2. Use of Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Provide, maintain, and improve our services.</li>
              <li>Process and complete travel bookings and transactions.</li>
              <li>Send you technical notices, updates, and support messages.</li>
              <li>Communicate with you about products, services, and offers.</li>
              <li>Personalize and improve the services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">3. Data Sharing</h2>
            <p>
              We may share your information with travel partners (airlines, hotels, car rental agencies) as necessary to fulfill your travel bookings. We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">4. Compliance with India DPDP Act</h2>
            <p>
              In accordance with the Digital Personal Data Protection Act, we ensure that your personal data is processed only for specified, lawful purposes. You have the right to access, correct, or erase your personal data stored with us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">5. Cookies</h2>
            <p>
              We use cookies and similar technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
