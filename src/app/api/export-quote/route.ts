import { NextResponse } from "next/server";
import type { ExportQuoteRequest, ExportQuoteResponse } from "@/types/product";

function computeQuoteLocal(body: ExportQuoteRequest): ExportQuoteResponse {
  const dutyRates: Record<string, number> = {
    US: 0.12,
    GB: 0.08,
    DE: 0.09,
    AE: 0.05,
    AU: 0.1,
    CA: 0.11,
    FR: 0.09,
    SG: 0.06,
  };
  const rate = dutyRates[body.country_code] ?? 0.1;
  const weightFactor = Math.ceil(body.total_units / 50);
  const shipping = 85 + weightFactor * 42;
  const duties = Math.round(body.declared_value_usd * rate);
  const docs = 45;
  const total = shipping + duties + docs + body.declared_value_usd;

  return {
    country_code: body.country_code,
    shipping_usd: shipping,
    duties_estimate_usd: duties,
    documentation_fee_usd: docs,
    total_landed_estimate_usd: total,
    eta_days: body.country_code === "AE" || body.country_code === "SG" ? 5 : 9,
    currency: "USD",
    service: "beltforge-node-fallback",
  };
}

export async function POST(request: Request) {
  let body: ExportQuoteRequest;
  try {
    body = (await request.json()) as ExportQuoteRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.country_code || !body.total_units || !body.declared_value_usd) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const goUrl = process.env.EXPORT_API_URL;
  if (goUrl) {
    try {
      const res = await fetch(`${goUrl.replace(/\/$/, "")}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = (await res.json()) as ExportQuoteResponse;
        return NextResponse.json(data);
      }
    } catch {
      // fall through to local compute
    }
  }

  return NextResponse.json(computeQuoteLocal(body));
}
