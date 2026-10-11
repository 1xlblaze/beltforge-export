import catalog from "@/data/belt-catalog.json";
import type { Product } from "@/types/product";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CatalogFile = {
  products: Product[];
  catalog: string;
  updated_at: string;
};

const beltCatalog = catalog as CatalogFile;

export async function getCatalogProducts(): Promise<{
  products: Product[];
  source: string;
}> {
  const fromDb = await (async () => {
    const supabase = createSupabaseServerClient();
    if (!supabase) return null;
    const { data } = await supabase.from("products").select("*").limit(100);
    return data?.length ? (data as Product[]) : null;
  })();

  if (fromDb?.length) {
    return { products: fromDb, source: "supabase" };
  }

  return { products: beltCatalog.products, source: "belt-catalog" };
}

export function getProductBySlugFromCache(slug: string): Product | undefined {
  return beltCatalog.products.find((p) => p.slug === slug);
}
