import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type OrderPayload = {
  company_name: string;
  contact_email: string;
  country_code: string;
  notes?: string;
  items: { product_id: string; quantity: number; unit_price_usd: number }[];
};

export async function POST(request: Request) {
  let body: OrderPayload;
  try {
    body = (await request.json()) as OrderPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.company_name || !body.contact_email || !body.items?.length) {
    return NextResponse.json({ error: "Incomplete inquiry" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({
      ok: true,
      mode: "demo",
      message:
        "Inquiry received (demo). Connect Supabase to persist wholesale orders.",
      reference: `BF-${Date.now().toString(36).toUpperCase()}`,
    });
  }

  const total = body.items.reduce(
    (s, i) => s + i.quantity * i.unit_price_usd,
    0,
  );

  const { data, error } = await supabase
    .from("export_inquiries")
    .insert({
      company_name: body.company_name,
      contact_email: body.contact_email,
      country_code: body.country_code,
      notes: body.notes ?? null,
      items: body.items,
      total_usd: total,
      status: "new",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    reference: data.id,
    message: "Wholesale export inquiry submitted.",
  });
}
