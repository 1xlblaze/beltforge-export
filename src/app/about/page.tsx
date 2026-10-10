import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our atelier",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold">Craft meets global trade</h1>
      <div className="mt-6 space-y-4 text-stone-300 leading-relaxed">
        <p>
          BeltForge Export started as a small leather atelier and grew into a wholesale
          partner for boutiques, e-commerce brands, and duty-free operators who need
          consistent designer belts shipped outside the country.
        </p>
        <p>
          Every SKU is built for repeat orders: stable materials, export packaging, and
          documentation aligned with HS 4203.30. Our stack—React storefront on Vercel,
          Supabase for catalog and inquiries, Node.js API routes, and a Go service for
          landed-cost math—keeps buyers and our export desk on the same page.
        </p>
        <p>
          Ready to list BeltForge in your next season? Start with the wholesale catalog or
          request a landed-cost estimate for your destination market.
        </p>
      </div>
    </div>
  );
}
