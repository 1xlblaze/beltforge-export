import catalog from "@/data/fizzy-kk-catalog.json";
import type { Product } from "@/types/product";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CatalogFile = {
  products: Product[];
  collection_url: string;
  synced_at: string;
};

const fizzy = catalog as CatalogFile;

const COLLECTION_URL =
  "https://www.fizzygoblet.com/collections/kareena-kapoor-khan-x-fizzy-goblet/products.json";

export async function refreshCatalogFromFizzy(): Promise<Product[] | null> {
  try {
    const all: Product[] = [];
    for (let page = 1; page <= 5; page++) {
      const res = await fetch(`${COLLECTION_URL}?limit=50&page=${page}`, {
        next: { revalidate: 3600 },
      });
      if (!res.ok) return null;
      const data = await res.json();
      const batch = data.products ?? [];
      if (!batch.length) break;
      for (const raw of batch) {
        const mapped = fizzy.products.find((p) => p.slug === raw.handle);
        if (mapped) all.push(mapped);
        else {
          all.push({
            id: String(raw.id),
            slug: raw.handle,
            name: raw.title,
            description: raw.title,
            long_description: raw.title,
            price_inr: Number(raw.variants?.[0]?.price ?? 0),
            price_usd: 48,
            moq: 25,
            material: raw.product_type ?? "Designer",
            width_cm: 3.8,
            image_url: raw.images?.[0]?.src ?? "",
            gallery: raw.images?.map((i: { src: string }) => i.src) ?? [],
            category: raw.product_type ?? "Collection",
            featured: false,
            export_ready: true,
            source: "fizzygoblet",
          });
        }
      }
      if (batch.length < 50) break;
    }
    return all.length ? all : null;
  } catch {
    return null;
  }
}

export async function getCatalogProducts(): Promise<{
  products: Product[];
  source: string;
  attribution: string;
}> {
  const fromDb = await (async () => {
    const supabase = createSupabaseServerClient();
    if (!supabase) return null;
    const { data } = await supabase.from("products").select("*").limit(100);
    return data?.length ? (data as Product[]) : null;
  })();

  if (fromDb?.length) {
    return {
      products: fromDb,
      source: "supabase",
      attribution: "",
    };
  }

  const live = await refreshCatalogFromFizzy();
  const products = live ?? fizzy.products;

  return {
    products,
    source: live ? "fizzygoblet-live" : "fizzygoblet-cache",
    attribution:
      "Product catalogue synced from Kareena Kapoor Khan x Fizzy Goblet (Fizzy Goblet). For export partnership inquiries only.",
  };
}

export function getProductBySlugFromCache(slug: string): Product | undefined {
  return fizzy.products.find((p) => p.slug === slug);
}

export const collectionAttributionUrl = fizzy.collection_url;
