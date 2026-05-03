import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // Mock data fetching based on slug
  const post = {
    title: "The Ultimate Guide to Luxury in the Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2070&auto=format&fit=crop",
    date: "May 1, 2026",
    author: "Elena Rossi",
    authorRole: "Senior Destination Expert",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop",
    readTime: "8 min read",
    content: `
      <p>The Maldives has long been the gold standard for barefoot luxury. With over 1,200 islands scattered across 26 atolls, this Indian Ocean archipelago offers a level of seclusion and service that is virtually unmatched anywhere else on the planet.</p>
      
      <h2>Choosing the Right Atoll</h2>
      <p>Not all islands are created equal. Depending on whether you're looking for world-class surfing, diving with manta rays, or the ultimate spa retreat, your choice of atoll is critical.</p>
      
      <blockquote>
        "Luxury in the Maldives isn't just about the thread count of your sheets; it's about the connection you feel with the ocean from the moment you wake up."
      </blockquote>

      <h2>The Rise of Sustainable Luxury</h2>
      <p>Many of the newer resorts are leading the way in coral reef restoration and solar energy. Staying at an eco-conscious resort no longer means compromising on comfort.</p>
    `
  };

  return (
    <div className="bg-white min-h-screen">
      <Navigation />
      
      <main className="pt-24">
        {/* Hero Section */}
        <div className="relative h-[70vh] w-full">
          <Image src={post.image} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-6 pb-20 w-full">
              <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-8 text-[10px] uppercase tracking-widest font-bold">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal
              </Link>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90 text-[10px] uppercase tracking-widest font-bold">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {post.date}</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {post.readTime}</span>
                <span className="flex items-center gap-2"><User className="w-4 h-4" /> By {post.author}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Main Article */}
            <article className="lg:col-span-8">
              <div 
                className="prose prose-lg prose-stone max-w-none 
                prose-headings:font-display prose-headings:font-bold prose-headings:text-ink
                prose-p:text-stone prose-p:leading-relaxed
                prose-blockquote:border-l-oxblood prose-blockquote:text-ink prose-blockquote:italic prose-blockquote:text-2xl
                prose-img:rounded-3xl"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              <div className="mt-16 pt-12 border-t border-stone-100 flex flex-wrap items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-stone-100">
                    <Image src={post.authorImage} alt={post.author} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">{post.author}</p>
                    <p className="text-[10px] text-stone uppercase tracking-widest">{post.authorRole}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-stone uppercase tracking-widest mr-2">Share</span>
                  <button className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-oxblood hover:text-white hover:border-oxblood transition-all">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-oxblood hover:text-white hover:border-oxblood transition-all">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-oxblood hover:text-white hover:border-oxblood transition-all">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-12">
              <div className="bg-cream rounded-3xl p-8 space-y-6">
                <h3 className="font-display text-xl font-bold text-ink">Plan your Maldives Escape</h3>
                <p className="text-stone text-sm leading-relaxed">
                  Inspired to visit the Maldives? Our travel specialists can craft a bespoke itinerary just for you.
                </p>
                <Link href="/search?type=hotel&destination=Maldives">
                  <Button className="w-full bg-oxblood hover:bg-oxblood/90 text-white font-bold uppercase tracking-widest text-[10px] h-12 rounded-xl">
                    Search Maldives Hotels
                  </Button>
                </Link>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-bold text-stone uppercase tracking-widest border-b border-stone-200 pb-4">Trending Now</h3>
                {[
                  "Kyoto Hidden Gems",
                  "Sustainable Luxury Travel",
                  "Top 10 Private Jet Routes 2026"
                ].map((title) => (
                  <Link key={title} href="#" className="group block">
                    <h4 className="text-sm font-bold text-ink group-hover:text-oxblood transition-colors line-clamp-2 leading-snug">
                      {title}
                    </h4>
                    <p className="text-[10px] text-stone uppercase tracking-widest mt-2 font-bold">5 min read</p>
                  </Link>
                ))}
              </div>
            </aside>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
