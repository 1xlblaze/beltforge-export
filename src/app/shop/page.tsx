import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { getCatalogProducts, collectionAttributionUrl } from "@/lib/catalog/get-products";

export const metadata: Metadata = {
  title: "KK × Fizzy Goblet export catalogue",
};

export default async function ShopPage() {
  const { products, attribution } = await getCatalogProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-stone-50">
        Kareena Kapoor Khan × Fizzy Goblet — export catalogue
      </h1>
      <p className="mt-2 max-w-3xl text-stone-400">
        Live-synced assortment from the{" "}
        <Link
          href={collectionAttributionUrl}
          className="text-amber-300 underline-offset-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fizzy Goblet collection
        </Link>
        . Click any product image to explode the 3D export belt and inspect materials,
        lining, and hardware—built for international wholesale partners entering the belt
        category.
      </p>
      {attribution && (
        <p className="mt-3 text-xs text-stone-500">{attribution}</p>
      )}
      <p className="mt-6 text-sm text-stone-500">{products.length} SKUs · MOQ 25 units export</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
