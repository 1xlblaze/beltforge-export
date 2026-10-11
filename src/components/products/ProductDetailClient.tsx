"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { Product } from "@/types/product";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/store/cart";

const ExplodableBeltViewer = dynamic(
  () =>
    import("@/components/3d/ExplodableBeltViewer").then((m) => m.ExplodableBeltViewer),
  { ssr: false },
);

type Props = { product: Product };

export function ProductDetailClient({ product }: Props) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(product.moq);
  const [show3d, setShow3d] = useState(false);

  return (
    <div className="mt-10 space-y-6">
      <div className="max-w-xs space-y-2">
        <Label htmlFor="qty">Export quantity (min {product.moq})</Label>
        <Input
          id="qty"
          type="number"
          min={product.moq}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="border-stone-700 bg-stone-950"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          className="bg-amber-500 text-stone-950 hover:bg-amber-400"
          onClick={() => add(product, qty)}
        >
          Add to export cart
        </Button>
        <Button
          variant="outline"
          className="border-amber-500/40 text-amber-100"
          onClick={() => setShow3d((v) => !v)}
        >
          {show3d ? "Hide" : "Open"} 3D belt anatomy
        </Button>
        <ButtonLink href="/export" variant="outline" className="border-stone-600">
          Estimate shipping
        </ButtonLink>
      </div>
      {show3d && <ExplodableBeltViewer product={product} />}
    </div>
  );
}
