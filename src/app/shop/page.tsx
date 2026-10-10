import type { Metadata } from "next";
import { ProductCard } from "@/components/products/ProductCard";
import { FALLBACK_PRODUCTS } from "@/lib/data/products";
import { fetchProductsFromDb } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Wholesale catalog",
};

export default async function ShopPage() {
  const fromDb = await fetchProductsFromDb();
  const products = fromDb ?? FALLBACK_PRODUCTS;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-stone-50">Wholesale catalog</h1>
      <p className="mt-2 max-w-2xl text-stone-400">
        Designer belts priced for export. Quantities respect MOQ per SKU. Add lines to your
        cart and submit a single international inquiry.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
