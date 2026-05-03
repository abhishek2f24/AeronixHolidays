import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <div className="bg-cream min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto pt-32 pb-24 px-6">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-8">Terms of Service</h1>
        
        <div className="prose prose-stone max-w-none space-y-8 text-stone">
          <section>
            <h2 className="text-xl font-bold text-ink mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Aeronix Holidays, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on Aeronix Holidays' website for personal, non-commercial transitory viewing only.
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Modify or copy the materials;</li>
              <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
              <li>Attempt to decompile or reverse engineer any software contained on Aeronix Holidays' website;</li>
              <li>Remove any copyright or other proprietary notations from the materials; or</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">3. Disclaimer</h2>
            <p>
              The materials on Aeronix Holidays' website are provided on an 'as is' basis. Aeronix Holidays makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">4. Limitations</h2>
            <p>
              In no event shall Aeronix Holidays or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Aeronix Holidays' website, even if Aeronix Holidays or an Aeronix Holidays authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">5. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </section>

          <section className="bg-stone-50 p-6 rounded-2xl border border-stone-200 mt-12">
            <h2 className="text-lg font-bold text-ink mb-2">Grievance Officer</h2>
            <p className="text-sm">
              In accordance with Information Technology Act 2000 and rules made there under, the name and contact details of the Grievance Officer are provided below:
            </p>
            <p className="mt-4 text-sm font-medium">
              Name: Abhishek Kumar<br />
              Email: grievance@aeronixholidays.com<br />
              Address: Gurugram, Haryana, India
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
