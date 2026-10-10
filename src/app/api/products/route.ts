import { NextResponse } from "next/server";
import { FALLBACK_PRODUCTS } from "@/lib/data/products";
import { fetchProductsFromDb } from "@/lib/supabase/server";

export async function GET() {
  const fromDb = await fetchProductsFromDb();
  return NextResponse.json({ products: fromDb ?? FALLBACK_PRODUCTS });
}
