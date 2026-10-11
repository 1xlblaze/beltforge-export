import { Package, ShieldCheck, Truck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { HeroSection } from "@/components/home/HeroSection";
import { getCatalogProducts } from "@/lib/catalog/get-products";

export default async function HomePage() {
  const { products } = await getCatalogProducts();
  const featured = products.filter((p) => p.featured).slice(0, 6);

  return (
    <>
      <HeroSection />

      <section className="border-y border-white/10 bg-stone-900/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6">
          {[
            {
              icon: Package,
              title: "Belts-only catalogue",
              text: "Every SKU is a belt line engineered for wholesale export—no mixed categories.",
            },
            {
              icon: Truck,
              title: "3D material breakdown",
              text: "Click any product image to open an explodable 3D belt—buckle, strap, core, lining, and edge.",
            },
            {
              icon: ShieldCheck,
              title: "International wholesale",
              text: "MOQ cart, landed-cost quotes, and documentation for shipping outside the country.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <item.icon className="size-8 shrink-0 text-amber-400" aria-hidden />
              <div>
                <h2 className="font-semibold text-stone-50">{item.title}</h2>
                <p className="mt-2 text-sm text-stone-400">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-stone-50 sm:text-3xl">
              Featured belt lines
            </h2>
            <p className="mt-2 text-stone-400">
              Tap imagery to explore construction in 3D before you add MOQ to your export cart.
            </p>
          </div>
          <ButtonLink href="/shop" variant="ghost" className="text-amber-300 hover:text-amber-200">
            Full catalogue ({products.length})
          </ButtonLink>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
