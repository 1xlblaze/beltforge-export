"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/store/cart";

type Props = { product: Product };

export function ProductDetailActions({ product }: Props) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(product.moq);

  return (
    <div className="mt-10 space-y-4">
      <div className="max-w-xs space-y-2">
        <Label htmlFor="qty">Order quantity (min {product.moq})</Label>
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
        <ButtonLink href="/export" variant="outline" className="border-stone-600">
          Estimate shipping
        </ButtonLink>
      </div>
    </div>
  );
}
