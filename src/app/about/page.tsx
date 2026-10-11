import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our atelier",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold">Belts built for global trade</h1>
      <div className="mt-6 space-y-4 text-stone-300 leading-relaxed">
        <p>
          BeltForge Export is a belts-only wholesale house for boutiques, e-commerce brands, and
          duty-free operators who need designer belts shipped outside the country.
        </p>
        <p>
          Every SKU in our catalogue is a belt line with export packaging, HS 4203.30 documentation,
          and an interactive 3D breakdown so buyers can inspect buckle, strap, core, lining, and edge
          finishes before placing MOQ orders.
        </p>
        <p>
          Our stack—React storefront on Vercel, Supabase for inquiries, Node.js APIs, and a Go
          landed-cost service—keeps your export desk and buyers aligned from quote to shipment.
        </p>
      </div>
    </div>
  );
}
