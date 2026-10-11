import { NextResponse } from "next/server";
import { getCatalogProducts } from "@/lib/catalog/get-products";

export async function GET() {
  const { products, source } = await getCatalogProducts();
  return NextResponse.json({ products, source });
}
