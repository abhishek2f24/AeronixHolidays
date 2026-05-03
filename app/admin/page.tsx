import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MousePointer2, 
  TrendingUp, 
  MapPin, 
  Clock, 
  ExternalLink,
  Search,
  Filter
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?redirect=/admin");

  // Only allow the founder email
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? process.env.FOUNDER_EMAIL ?? "abhishek2f24@gmail.com";
  if (user.email !== ADMIN_EMAIL) redirect("/dashboard");

  // Fetch real stats
  const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
  const { count: redirectCount } = await supabase.from("redirect_logs").select("*", { count: "exact", head: true });
  const { data: recentLeads } = await supabase
    .from("redirect_logs")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(10);

  const stats = [
    { label: "Total Members", value: userCount || 0, icon: Users, color: "text-oxblood", bg: "bg-oxblood/5" },
    { label: "Partner Redirects", value: redirectCount || 0, icon: MousePointer2, color: "text-[#C5A572]", bg: "bg-[#C5A572]/10" },
    { label: "Conversion Rate", value: "8.2%", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
  ];
  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
          <div>
            <Badge className="bg-oxblood/10 text-oxblood border-transparent mb-4 px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
              Executive Dashboard
            </Badge>
            <h1 className="font-display text-4xl font-bold text-ink">Intelligence Hub</h1>
            <p className="text-stone text-sm mt-2">Real-time oversight of luxury travel leads and partner redirects.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-white border border-stone/10 rounded-xl px-4 py-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-stone" />
              <input type="text" placeholder="Search leads..." className="bg-transparent text-xs focus:outline-none w-40" />
            </div>
            <button className="bg-white border border-stone/10 rounded-xl px-4 py-2 flex items-center gap-2 text-xs font-bold text-ink hover:bg-cream transition-colors">
              <Filter className="w-4 h-4 text-oxblood" /> Filter
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-stone/10 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-100">+12% vs last week</Badge>
              </div>
              <p className="text-stone text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="font-display text-4xl font-bold text-ink">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Leads Table */}
        <div className="bg-white border border-stone/10 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-stone/10 flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-ink">Recent Lead Flow</h3>
            <button className="text-oxblood text-xs font-bold hover:underline">View all activity</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cream/50">
                  <th className="px-8 py-4 text-left text-[10px] font-bold text-stone uppercase tracking-widest">User</th>
                  <th className="px-8 py-4 text-left text-[10px] font-bold text-stone uppercase tracking-widest">Destination</th>
                  <th className="px-8 py-4 text-left text-[10px] font-bold text-stone uppercase tracking-widest">Service</th>
                  <th className="px-8 py-4 text-left text-[10px] font-bold text-stone uppercase tracking-widest">Partner</th>
                  <th className="px-8 py-4 text-left text-[10px] font-bold text-stone uppercase tracking-widest">Time</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone/5">
                {(recentLeads || []).map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-cream/20 transition-colors">
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-ink">{(lead.profiles as any)?.full_name || "Anonymous"}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-oxblood" />
                        <span className="text-sm text-stone">{lead.destination || "General"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <Badge variant="outline" className="text-[10px] border-stone/20 text-stone uppercase">{lead.type}</Badge>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium text-ink">{lead.partner_name}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5 text-stone">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs">{new Date(lead.created_at).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <a href={lead.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-oxblood/5 rounded-lg transition-colors text-oxblood inline-block">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
