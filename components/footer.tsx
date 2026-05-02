import Link from "next/link";

/* ── Social SVG icons (inline) ── */
function Instagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function LinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function XTwitter() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function YouTube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  );
}

/* ── Column 2: Popular Searches (SEO + utility) ── */
const POPULAR = [
  { label: "Flights to Dubai",        href: "/search?type=flight&to=DXB" },
  { label: "Flights to London",       href: "/search?type=flight&to=LHR" },
  { label: "Flights to Bangkok",      href: "/search?type=flight&to=BKK" },
  { label: "Hotels in Goa",           href: "/search?type=hotel&destination=GOA" },
  { label: "Hotels in Dubai",         href: "/search?type=hotel&destination=DXB" },
  { label: "Maldives Packages",       href: "/packages?destination=maldives" },
  { label: "Kerala Honeymoon",        href: "/packages?destination=kerala" },
  { label: "Europe Tour Packages",    href: "/packages?destination=europe" },
  { label: "Thailand Family Trip",    href: "/packages?destination=thailand" },
  { label: "Schengen Visa Help",      href: "/visa?region=europe" },
];

/* ── Column 3: Company ── */
const COMPANY = [
  { label: "About Us",             href: "/about" },
  { label: "How It Works",         href: "/how-it-works" },
  { label: "Partner With Us",      href: "/partners" },
  { label: "Careers",              href: "/careers" },
  { label: "Travel Blog",          href: "/blog" },
  { label: "Contact Us",           href: "/contact" },
  { label: "Report an Issue",      href: "/support" },
  { label: "Advertise With Us",    href: "/advertise" },
];

/* ── Column 4: Trust & Support ── */
const TRUST = [
  { label: "Customer Support",    href: "/support" },
  { label: "Payment Security",    href: "/security" },
  { label: "Privacy Policy",      href: "/privacy" },
  { label: "Terms of Service",    href: "/terms" },
  { label: "Refund & Cancellation", href: "/refunds" },
  { label: "Sustainability",      href: "/sustainability" },
  { label: "Cookie Policy",       href: "/cookies" },
];

/* ── SEO link wall ── */
const TOP_DESTINATIONS = [
  "Paris Luxury Escapes", "Maldives Private Islands", "Santorini Honeymoons",
  "Swiss Alps Retreats", "Kyoto Cultural Tours", "Dubai Royal Suites",
  "Bali Wellness Journeys", "Amalfi Coast Villas", "Singapore City Breaks",
  "Tokyo Luxury Stays", "New York Private Tours", "London Heritage Suites",
  "Mauritius Beach Resorts", "Phuket Island Escapes", "Istanbul City Tours",
];

const ELITE_LINKS = [
  "Private Jet Charters", "Luxury Cruise Bookings", "Personal Tour Guides",
  "First-Class Flight Deals", "7-Star Hotel Bookings", "Corporate Retreat Planning",
  "Anniversary Gift Experiences", "Honeymoon Packages India", "Family Luxury Vacations",
  "Adventure Travel India", "Europe Schengen Visa Help", "Thailand Beach Resorts",
  "Kashmir Houseboat Stay", "Rajasthan Heritage Tour", "Andaman Island Packages",
];

/* ── Payment logos as styled text badges (no broken image deps) ── */
function PaymentBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded px-2.5 py-1 bg-white"
      style={{ height: 26 }}
    >
      <span className={`text-[10px] font-black tracking-tight leading-none ${color}`}>{label}</span>
    </span>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#080A0F] text-white">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">

        {/* ── 4-column grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-14 border-b border-white/[0.07]">

          {/* Column 1 — Brand */}
          <div>
            <Link href="/">
              <img src="/logo3.png" alt="Aeronix Holidays" className="h-16 w-auto mb-6" />
            </Link>
            <p className="text-[13px] text-white/45 leading-relaxed mb-8 max-w-[210px]">
              Redefining global exploration through private AI concierge and bespoke luxury experiences.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <Instagram />, href: "https://instagram.com/aeronixholidays", label: "Instagram" },
                { icon: <LinkedIn />,  href: "https://linkedin.com/company/aeronixholidays", label: "LinkedIn" },
                { icon: <XTwitter />,  href: "https://x.com/aeronixholidays", label: "X" },
                { icon: <YouTube />,   href: "https://youtube.com/@aeronixholidays", label: "YouTube" },
              ].map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-[#C5A572] hover:border-[#C5A572]/40 transition-all duration-300"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Popular Searches */}
          <div>
            <h4 className="font-display text-[11px] uppercase tracking-[0.25em] font-bold text-[#C5A572] mb-6">
              Popular Searches
            </h4>
            <ul className="space-y-3">
              {POPULAR.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[13px] text-white/55 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2.5 h-px bg-[#C5A572] transition-all duration-300 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Company */}
          <div>
            <h4 className="font-display text-[11px] uppercase tracking-[0.25em] font-bold text-[#C5A572] mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              {COMPANY.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[13px] text-white/55 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2.5 h-px bg-[#C5A572] transition-all duration-300 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Trust & Support */}
          <div>
            <h4 className="font-display text-[11px] uppercase tracking-[0.25em] font-bold text-[#C5A572] mb-6">
              Trust &amp; Support
            </h4>
            <ul className="space-y-3 mb-8">
              {TRUST.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[13px] text-white/55 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2.5 h-px bg-[#C5A572] transition-all duration-300 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Secure payment badges */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-3 font-semibold">Secure Payments</p>
              <div className="flex flex-wrap items-center gap-2">
                {/* Visa — CSS badge (image was broken) */}
                <span className="inline-flex items-center justify-center rounded px-2.5 bg-white" style={{ height: 26, minWidth: 44 }}>
                  <span className="text-[11px] font-black tracking-tight" style={{ color: "#1A1F71", fontStyle: "italic" }}>VISA</span>
                </span>
                {/* Mastercard, Amex, Razorpay, UPI — original images */}
                {[
                  { src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg", alt: "Mastercard" },
                  { src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg", alt: "Amex" },
                  { src: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg", alt: "Razorpay" },
                  { src: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg", alt: "UPI" },
                ].map(({ src, alt }) => (
                  <div key={alt} className="bg-white rounded px-2 py-1 flex items-center justify-center" style={{ height: 26, minWidth: 40 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={alt} className="h-4 w-auto object-contain"
                      onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = "none"; }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SEO Link Wall ── */}
        <div className="py-10 border-b border-white/[0.05]">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#C5A572]/50 mb-4">Top Destinations</p>
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {TOP_DESTINATIONS.map((dest, i) => (
                  <span key={dest} className="flex items-center gap-3">
                    <Link
                      href={`/destinations/${dest.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-[11px] text-white/22 hover:text-white/55 transition-colors duration-200"
                    >
                      {dest}
                    </Link>
                    {i < TOP_DESTINATIONS.length - 1 && <span className="text-white/10 text-[10px]">•</span>}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#C5A572]/50 mb-4">Elite Travel</p>
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {ELITE_LINKS.map((link, i) => (
                  <span key={link} className="flex items-center gap-3">
                    <Link
                      href={`/packages?category=${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-[11px] text-white/22 hover:text-white/55 transition-colors duration-200"
                    >
                      {link}
                    </Link>
                    {i < ELITE_LINKS.length - 1 && <span className="text-white/10 text-[10px]">•</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/20 tracking-wide">
            © {new Date().getFullYear()} Aeronix Holidays. All Rights Reserved.
          </p>
          <p className="text-[11px] text-white/12 tracking-wide text-center">
            Trusted by Global Luxury Partners &nbsp;|&nbsp; 1,400+ Verified Suppliers across 62 Countries
          </p>
          <p className="font-display italic text-sm text-[#C5A572]/30 tracking-wide">
            &ldquo;Journeys measured in memories, not miles.&rdquo;
          </p>
        </div>

      </div>
    </footer>
  );
}
