import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aeronix Holidays | Bespoke Luxury Travel & Private AI Concierge",
  description:
    "Experience the pinnacle of global exploration. Private jet charters, elite villa retreats, and curated luxury journeys managed by Odin, your personal AI concierge.",
  openGraph: {
    title: "Aeronix Holidays | Bespoke Luxury Travel",
    description: "Your private travel firm. Redefining luxury through AI and bespoke expertise.",
    url: "https://www.aeronixholidays.com",
    siteName: "Aeronix Holidays",
    images: [
      {
        url: "https://aeronixholidays.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aeronix Holidays Luxury Travel",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aeronix Holidays | Bespoke Luxury Travel",
    description: "Your private travel firm. Redefining luxury through AI and bespoke expertise.",
    images: ["https://aeronixholidays.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <CookieConsent />
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
