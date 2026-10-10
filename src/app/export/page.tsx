import type { Metadata } from "next";
import { ExportQuoteForm } from "@/components/export/ExportQuoteForm";

export const metadata: Metadata = {
  title: "International export",
};

export default function ExportPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-stone-50">Ship designer belts abroad</h1>
      <p className="mt-3 max-w-2xl text-stone-400">
        Estimate freight, duties, and documentation for leather belt exports. Quotes are
        computed by our Go export microservice when deployed, with a Node.js fallback on
        Vercel.
      </p>
      <div className="mt-10">
        <ExportQuoteForm />
      </div>
    </div>
  );
}
