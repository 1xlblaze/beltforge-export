import { createClient } from "@supabase/supabase-js";
import type { Product } from "@/types/product";

export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function fetchProductsFromDb(): Promise<Product[] | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("export_ready", true)
    .order("featured", { ascending: false });

  if (error || !data?.length) return null;
  return data as Product[];
}
