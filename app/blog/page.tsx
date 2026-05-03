import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const POSTS = [
  {
    title: "The Ultimate Guide to Luxury in the Maldives",
    excerpt: "Discover the most exclusive overwater villas and underwater dining experiences in the world's premier island destination.",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2070&auto=format&fit=crop",
    date: "May 1, 2026",
    author: "Elena Rossi",
    category: "Destinations",
    slug: "luxury-maldives-guide"
  },
  {
    title: "10 Hidden Gems in Kyoto You Must Visit",
    excerpt: "Beyond the golden pavilion lies a world of secret tea houses and ancient moss gardens waiting to be explored.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
    date: "April 28, 2026",
    author: "Hiroshi Tanaka",
    category: "Culture",
    slug: "kyoto-hidden-gems"
  },
  {
    title: "Sustainable Travel: The New Frontier of Luxury",
    excerpt: "How the world's most elite resorts are redefining luxury through conservation and community engagement.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop",
    date: "April 24, 2026",
    author: "Julian Thorne",
    category: "Trends",
    slug: "sustainable-luxury-travel"
  }
];

export default function BlogPage() {
  return (
    <div className="bg-cream min-h-screen">
      <Navigation />
      
      <main className="max-w-7xl mx-auto pt-32 pb-24 px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-6">The Aeronix Journal</h1>
          <p className="text-stone text-lg leading-relaxed">
            Expert insights, destination guides, and the latest trends in ultra-luxury travel, curated by our global concierge team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-md text-oxblood border-transparent text-[10px] uppercase tracking-widest font-bold">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-[10px] text-stone uppercase tracking-widest font-bold mb-4">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-ink mb-4 group-hover:text-oxblood transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-stone text-sm leading-relaxed line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center text-oxblood font-bold text-[10px] uppercase tracking-[0.2em]">
                    Read Article <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Newsletter Section */}
        <section className="mt-24 bg-oxblood rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl -mr-32 -mt-32 rounded-full" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">Subscribe to the Journal</h2>
            <p className="text-white/70 text-lg mb-10">
              Join 50,000+ luxury travelers receiving our weekly curated list of exclusive offers and hidden destinations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 bg-transparent border-none text-white placeholder-white/40 px-4 h-12 focus:ring-0 focus:outline-none" 
              />
              <Button className="bg-white text-oxblood hover:bg-stone-100 font-bold uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl">
                Join Now
              </Button>
            </div>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mt-6">
              Respecting your privacy since 2026. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
      {children}
    </span>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
