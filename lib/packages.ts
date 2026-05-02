import { createClient } from "@/lib/supabase/server";

export interface Package {
  id: string;
  slug: string;
  title: string;
  destination: string;
  duration_days: number;
  price_inr: number;
  original_price_inr?: number;
  inclusions: string[];
  exclusions: string[];
  itinerary: {
    day: number;
    title: string;
    activities: string[];
  }[];
  images: string[];
  category: string;
  is_active: boolean;
  max_pax: number;
  created_at: string;
}

export async function getPackages(filters?: { category?: string; destination?: string }) {
  const supabase = await createClient();
  let query = supabase.from("packages").select("*").eq("is_active", true);

  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.destination) query = query.ilike("destination", `%${filters.destination}%`);

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching packages:", error);
    return [];
  }

  return data as Package[];
}

export async function getPackageBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`Error fetching package ${slug}:`, error);
    return null;
  }

  return data as Package;
}
