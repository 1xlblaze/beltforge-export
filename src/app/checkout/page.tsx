"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/store/cart";

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("US");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ reference: string; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (lines.length === 0 && !result) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-stone-400">Add products before submitting an inquiry.</p>
        <ButtonLink href="/shop" className="mt-6" variant="outline">
          Go to catalog
        </ButtonLink>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: company,
          contact_email: email,
          country_code: country,
          notes,
          items: lines.map((l) => ({
            product_id: l.product.id,
            quantity: l.quantity,
            unit_price_usd: l.product.price_usd,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setResult({
        reference: data.reference ?? "—",
        message: data.message ?? "Thank you.",
      });
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-emerald-400">Inquiry received</h1>
        <p className="mt-4 text-stone-300">{result.message}</p>
        <p className="mt-2 font-mono text-sm text-amber-300">Ref: {result.reference}</p>
        <ButtonLink href="/" className="mt-8 bg-amber-500 text-stone-950">
          Return home
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold">Wholesale export inquiry</h1>
      <p className="mt-2 text-stone-400">
        Our export desk will respond within one business day with proforma invoice and
        shipping options.
      </p>
      <p className="mt-4 text-lg text-amber-300">
        Order subtotal: ${subtotal().toLocaleString()} USD
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="company">Company / boutique name</Label>
          <Input
            id="company"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="border-stone-700 bg-stone-950"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Business email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-stone-700 bg-stone-950"
          />
        </div>
        <div className="space-y-2">
          <Label>Ship-to country</Label>
          <Select value={country} onValueChange={(v) => setCountry(v ?? "US")}>
            <SelectTrigger className="border-stone-700 bg-stone-950">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="GB">United Kingdom</SelectItem>
              <SelectItem value="DE">Germany</SelectItem>
              <SelectItem value="AE">UAE</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (incoterms, branding, timeline)</Label>
          <Textarea
            id="notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border-stone-700 bg-stone-950"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 text-stone-950 hover:bg-amber-400"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Submit inquiry"}
        </Button>
      </form>
    </div>
  );
}
