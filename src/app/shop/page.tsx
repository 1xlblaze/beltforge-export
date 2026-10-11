import type { Metadata } from "next";
import { ProductCard } from "@/components/products/ProductCard";
import { getCatalogProducts } from "@/lib/catalog/get-products";

export const metadata: Metadata = {
  title: "Belt export catalogue",
};

export default async function ShopPage() {
  const { products } = await getCatalogProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-stone-50">Belt export catalogue</h1>
      <p className="mt-2 max-w-3xl text-stone-400">
        BeltForge wholesale assortment—belts only. Click any product image to open the explodable
        3D view and inspect buckle, strap, core, lining, and edge layers before you submit an
        international inquiry.
      </p>
      <p className="mt-6 text-sm text-stone-500">{products.length} belt SKUs · MOQ from 15 units</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
