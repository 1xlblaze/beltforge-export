import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const COLLECTION = "kareena-kapoor-khan-x-fizzy-goblet";
const BASE = `https://www.fizzygoblet.com/collections/${COLLECTION}/products.json`;

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inferLayers(title, productType, body) {
  const text = `${title} ${productType} ${body}`.toLowerCase();
  const accent = text.includes("gold")
    ? "Antique gold hardware"
    : text.includes("silver")
      ? "Silver-tone hardware"
      : text.includes("pearl")
        ? "Pearl and bead accents"
        : "Heritage metal buckle";
  return [
    {
      id: "buckle",
      name: "Statement buckle",
      material: accent,
      description: "Cast and polished buckle plate engineered for export-grade repeat orders.",
    },
    {
      id: "outer",
      name: "Outer strap",
      material: text.includes("velvet")
        ? "Velvet-finish textile overlay"
        : text.includes("leather")
          ? "Full-grain leather"
          : "Embroidered textile with resin backing",
      description: "Visible design layer inspired by Kareena Kapoor Khan x Fizzy Goblet craftsmanship.",
    },
    {
      id: "core",
      name: "Reinforced core",
      material: "Multi-ply cotton & polymer stabilizer",
      description: "Maintains belt shape through international freight and climate shifts.",
    },
    {
      id: "lining",
      name: "Inner lining",
      material: "Soft suede-touch lining",
      description: "Skin-friendly interior finish for premium retail partners abroad.",
    },
    {
      id: "edge",
      name: "Edge & stitch",
      material: "Waxed thread, edge-painted perimeter",
      description: "Hand-finished edges meeting export QC for EU and GCC buyers.",
    },
  ];
}

async function fetchAllProducts() {
  const all = [];
  for (let page = 1; page <= 5; page++) {
    const url = `${BASE}?limit=50&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
    const data = await res.json();
    const batch = data.products ?? [];
    if (!batch.length) break;
    all.push(...batch);
    if (batch.length < 50) break;
  }
  return all;
}

function mapProduct(raw) {
  const body = stripHtml(raw.body_html);
  const priceInr = Number(raw.variants?.[0]?.price ?? 0);
  const images = (raw.images ?? []).map((i) => i.src).filter(Boolean);
  const slug = raw.handle;
  return {
    id: String(raw.id),
    slug,
    name: raw.title,
    description: body.slice(0, 160) || raw.title,
    long_description:
      body ||
      `${raw.title} — catalogue style from the Kareena Kapoor Khan x Fizzy Goblet collection, offered for international wholesale export.`,
    price_inr: priceInr,
    price_usd: Math.max(12, Math.round((priceInr / 84) * 0.45)),
    moq: 25,
    material: raw.product_type || "Designer accessory",
    width_cm: 3.8,
    image_url: images[0] ?? "",
    gallery: images,
    category: raw.product_type?.replace(/^Shoes -\s*/i, "") || "Collection",
    featured: Boolean(raw.tags?.includes("featured")),
    export_ready: true,
    source: "fizzygoblet",
    collection: COLLECTION,
    vendor: raw.vendor ?? "Fizzy Goblet",
    layers: inferLayers(raw.title, raw.product_type, body),
  };
}

const rawProducts = await fetchAllProducts();
const products = rawProducts.map(mapProduct);
products.forEach((p, i) => {
  if (i < 6) p.featured = true;
});

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "fizzy-kk-catalog.json");
writeFileSync(
  outPath,
  JSON.stringify(
    {
      synced_at: new Date().toISOString(),
      collection: COLLECTION,
      collection_url:
        "https://www.fizzygoblet.com/collections/kareena-kapoor-khan-x-fizzy-goblet",
      products,
    },
    null,
    2,
  ),
);
console.log(`Wrote ${products.length} products to ${outPath}`);
