import type { Product } from "@/types/product";

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "midnight-artisan-leather",
    name: "Midnight Artisan Leather",
    description: "Hand-tooled full-grain belt with brushed nickel buckle.",
    long_description:
      "Crafted in small batches for international boutiques. Vegetable-tanned leather, edge-painted finish, and export-grade packaging. Ideal for premium menswear and concept stores.",
    price_usd: 42,
    moq: 50,
    material: "Full-grain leather",
    width_cm: 3.5,
    image_url:
      "https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=800&q=80",
    category: "Classic",
    featured: true,
    export_ready: true,
  },
  {
    id: "2",
    slug: "woven-desert-suede",
    name: "Woven Desert Suede",
    description: "Textured suede with contrast stitch and matte brass hardware.",
    long_description:
      "A statement piece for resort and lifestyle retailers. Suede sourced for color consistency across bulk orders. Includes care cards in EN, FR, and DE.",
    price_usd: 38,
    moq: 75,
    material: "Suede",
    width_cm: 4,
    image_url:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    category: "Contemporary",
    featured: true,
    export_ready: true,
  },
  {
    id: "3",
    slug: "atelier-chain-belt",
    name: "Atelier Chain Belt",
    description: "Designer chain-accent belt for elevated street-luxury lines.",
    long_description:
      "Modular chain links with reinforced leather core. Built for repeat wholesale partners with stable lead times and HS code documentation on request.",
    price_usd: 56,
    moq: 40,
    material: "Leather + alloy",
    width_cm: 3,
    image_url:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    category: "Designer",
    featured: true,
    export_ready: true,
  },
  {
    id: "4",
    slug: "heritage-reversible",
    name: "Heritage Reversible",
    description: "Two-tone reversible belt with rotating buckle mechanism.",
    long_description:
      "Doubles assortment depth without doubling SKU footprint. Popular with duty-free and travel retail. Custom embossing available from 200 units.",
    price_usd: 48,
    moq: 60,
    material: "Calf leather",
    width_cm: 3.5,
    image_url:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    category: "Classic",
    featured: false,
    export_ready: true,
  },
  {
    id: "5",
    slug: "minimal-canvas-export",
    name: "Minimal Canvas Export",
    description: "Lightweight canvas belt for casual global brands.",
    long_description:
      "Cost-efficient export line with consistent dye lots. Perfect for seasonal capsules and private-label programs shipping outside the country.",
    price_usd: 22,
    moq: 100,
    material: "Waxed canvas",
    width_cm: 4,
    image_url:
      "https://images.unsplash.com/photo-1548036327-c9fa89d128fa?w=800&q=80",
    category: "Casual",
    featured: false,
    export_ready: true,
  },
  {
    id: "6",
    slug: "runway-wide-statement",
    name: "Runway Wide Statement",
    description: "Wide designer belt with signature plate buckle.",
    long_description:
      "Runway-inspired silhouette for concept stores and editorial drops. Includes export compliance sheet and suggested retail bands by region.",
    price_usd: 64,
    moq: 30,
    material: "Structured leather",
    width_cm: 5,
    image_url:
      "https://images.unsplash.com/photo-1594223274511-bbaaef050d4b?w=800&q=80",
    category: "Designer",
    featured: false,
    export_ready: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return FALLBACK_PRODUCTS.find((p) => p.slug === slug);
}
