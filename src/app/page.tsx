import Link from "next/link";
import { Package, ShieldCheck, Truck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { HeroSection } from "@/components/home/HeroSection";
import { FALLBACK_PRODUCTS } from "@/lib/data/products";

const featured = FALLBACK_PRODUCTS.filter((p) => p.featured);

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="border-y border-white/10 bg-stone-900/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6">
          {[
            {
              icon: Package,
              title: "MOQ-friendly lines",
              text: "Start at 30–100 units per SKU with stable lead times for repeat export orders.",
            },
            {
              icon: Truck,
              title: "Door-to-door export",
              text: "Air freight estimates, HS documentation, and commercial invoices handled in-house.",
            },
            {
              icon: ShieldCheck,
              title: "Buyer-ready compliance",
              text: "Material declarations and origin certificates for US, EU, GCC, and APAC retail partners.",
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
              Featured export styles
            </h2>
            <p className="mt-2 text-stone-400">
              Curated designer belts ready for international boutique and e-commerce buyers.
            </p>
          </div>
          <ButtonLink href="/shop" variant="ghost" className="text-amber-300 hover:text-amber-200">
            View all SKUs
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
