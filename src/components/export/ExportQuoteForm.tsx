"use client";

import { useState } from "react";
import { Loader2, Plane } from "lucide-react";
import type { ExportQuoteResponse } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COUNTRIES = [
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "DE", label: "Germany" },
  { code: "AE", label: "United Arab Emirates" },
  { code: "AU", label: "Australia" },
  { code: "CA", label: "Canada" },
  { code: "FR", label: "France" },
  { code: "SG", label: "Singapore" },
];

type Props = {
  defaultUnits?: number;
  defaultValue?: number;
};

export function ExportQuoteForm({ defaultUnits = 100, defaultValue = 5000 }: Props) {
  const [country, setCountry] = useState("US");
  const [units, setUnits] = useState(String(defaultUnits));
  const [value, setValue] = useState(String(defaultValue));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<ExportQuoteResponse | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setQuote(null);
    try {
      const res = await fetch("/api/export-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country_code: country,
          total_units: Number(units),
          declared_value_usd: Number(value),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Quote failed");
      setQuote(data as ExportQuoteResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-stone-800 bg-stone-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-stone-50">
            <Plane className="size-5 text-amber-400" />
            International landed cost estimate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Destination country</Label>
              <Select value={country} onValueChange={(v) => setCountry(v ?? "US")}>
                <SelectTrigger className="border-stone-700 bg-stone-950">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="units">Total units</Label>
                <Input
                  id="units"
                  type="number"
                  min={1}
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="border-stone-700 bg-stone-950"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Declared value (USD)</Label>
                <Input
                  id="value"
                  type="number"
                  min={1}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="border-stone-700 bg-stone-950"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 text-stone-950 hover:bg-amber-400"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Calculating…
                </>
              ) : (
                "Calculate export quote"
              )}
            </Button>
            <p className="text-xs text-stone-500">
              Estimates include freight, documentation, and indicative duties. Final
              commercial invoice prepared by our export desk.
            </p>
          </form>
        </CardContent>
      </Card>

      <Card className="border-stone-800 bg-gradient-to-br from-stone-900 to-stone-950">
        <CardHeader>
          <CardTitle className="text-stone-50">Quote breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {!quote && !loading && (
            <p className="text-sm text-stone-500">
              Run a calculation to see shipping, duties, and total landed estimate for
              your wholesale belt order.
            </p>
          )}
          {quote && (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone-400">Air freight estimate</dt>
                <dd className="font-medium text-stone-100">${quote.shipping_usd}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-400">Duties (indicative)</dt>
                <dd className="font-medium text-stone-100">${quote.duties_estimate_usd}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-400">Export documentation</dt>
                <dd className="font-medium text-stone-100">${quote.documentation_fee_usd}</dd>
              </div>
              <div className="flex justify-between border-t border-stone-800 pt-3 text-base">
                <dt className="text-stone-200">Total landed estimate</dt>
                <dd className="font-semibold text-amber-300">
                  ${quote.total_landed_estimate_usd}
                </dd>
              </div>
              <p className="text-xs text-stone-500">
                ETA ~{quote.eta_days} days · Engine: {quote.service}
              </p>
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
