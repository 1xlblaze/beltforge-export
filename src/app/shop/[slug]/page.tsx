import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailActions } from "@/components/products/ProductDetailActions";
import { FALLBACK_PRODUCTS, getProductBySlug } from "@/lib/data/products";
import { fetchProductsFromDb } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return FALLBACK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

async function resolveProduct(slug: string) {
  const fromDb = await fetchProductsFromDb();
  const list = fromDb ?? FALLBACK_PRODUCTS;
  return list.find((p) => p.slug === slug) ?? getProductBySlug(slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await resolveProduct(slug);
  if (!product) return { title: "Product" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await resolveProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <ButtonLink href="/shop" variant="ghost" className="mb-6 text-stone-400 hover:text-stone-200">
        ← Back to catalog
      </ButtonLink>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-stone-800">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-amber-500/50 text-amber-200">
              {product.category}
            </Badge>
            {product.export_ready && (
              <Badge className="bg-emerald-600/90">Export ready</Badge>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-stone-50">{product.name}</h1>
          <p className="mt-2 text-2xl text-amber-300">${product.price_usd} USD / unit</p>
          <p className="mt-6 text-stone-300">{product.long_description}</p>
          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-stone-500">Material</dt>
              <dd className="font-medium">{product.material}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Width</dt>
              <dd className="font-medium">{product.width_cm} cm</dd>
            </div>
            <div>
              <dt className="text-stone-500">MOQ</dt>
              <dd className="font-medium">{product.moq} units</dd>
            </div>
            <div>
              <dt className="text-stone-500">HS code</dt>
              <dd className="font-medium">4203.30</dd>
            </div>
          </dl>
          <ProductDetailActions product={product} />
        </div>
      </div>
    </div>
  );
}
