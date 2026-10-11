import { NextResponse } from "next/server";
import { getCatalogProducts } from "@/lib/catalog/get-products";

export async function GET() {
  const { products, source, attribution } = await getCatalogProducts();
  return NextResponse.json({ products, source, attribution });
}
