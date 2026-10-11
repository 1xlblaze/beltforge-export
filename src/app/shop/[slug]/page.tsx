import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import catalog from "@/data/fizzy-kk-catalog.json";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { getCatalogProducts, getProductBySlugFromCache } from "@/lib/catalog/get-products";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { Product } from "@/types/product";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return (catalog.products as Product[]).map((p) => ({ slug: p.slug }));
}

async function resolveProduct(slug: string): Promise<Product | undefined> {
  const { products } = await getCatalogProducts();
  return products.find((p) => p.slug === slug) ?? getProductBySlugFromCache(slug);
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

  const gallery = product.gallery?.length ? product.gallery : [product.image_url];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <ButtonLink href="/shop" variant="ghost" className="mb-6 text-stone-400 hover:text-stone-200">
        ← Back to catalogue
      </ButtonLink>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-3">
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
          <div className="grid grid-cols-4 gap-2">
            {gallery.slice(0, 4).map((src) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-lg border border-stone-800">
                <Image src={src} alt="" fill className="object-cover" sizes="120px" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-amber-500/50 text-amber-200">
              {product.category}
            </Badge>
            {product.export_ready && (
              <Badge className="bg-emerald-600/90">Export ready</Badge>
            )}
            {product.source === "fizzygoblet" && (
              <Badge variant="outline" className="border-stone-600 text-stone-300">
                Fizzy Goblet catalogue
              </Badge>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-stone-50">{product.name}</h1>
          <p className="mt-2 text-2xl text-amber-300">
            ${product.price_usd} USD export
            {product.price_inr ? (
              <span className="ml-2 text-base text-stone-500">
                (retail ref ₹{product.price_inr.toLocaleString("en-IN")})
              </span>
            ) : null}
          </p>
          <p className="mt-6 text-stone-300">{product.long_description}</p>
          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-stone-500">Material / type</dt>
              <dd className="font-medium">{product.material}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Belt width (export)</dt>
              <dd className="font-medium">{product.width_cm} cm</dd>
            </div>
            <div>
              <dt className="text-stone-500">MOQ</dt>
              <dd className="font-medium">{product.moq} units</dd>
            </div>
            <div>
              <dt className="text-stone-500">Vendor ref</dt>
              <dd className="font-medium">{product.vendor ?? "Fizzy Goblet"}</dd>
            </div>
          </dl>
          <ProductDetailClient product={product} />
        </div>
      </div>
    </div>
  );
}
