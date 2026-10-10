"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/store/cart";

export default function CartPage() {
  const { lines, remove, setQuantity, subtotal, clear } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-semibold">Your export cart is empty</h1>
        <p className="mt-3 text-stone-400">
          Add designer belt SKUs at MOQ to build a wholesale inquiry.
        </p>
        <ButtonLink href="/shop" className="mt-8 bg-amber-500 text-stone-950 hover:bg-amber-400">
          Browse catalog
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Export cart</h1>
        <Button variant="ghost" className="text-stone-400" onClick={() => clear()}>
          Clear cart
        </Button>
      </div>
      <ul className="mt-8 divide-y divide-stone-800">
        {lines.map(({ product, quantity }) => (
          <li key={product.id} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg">
              <Image src={product.image_url} alt="" fill className="object-cover" sizes="80px" />
            </div>
            <div className="flex-1">
              <Link href={`/shop/${product.slug}`} className="font-medium hover:text-amber-200">
                {product.name}
              </Link>
              <p className="text-sm text-stone-500">
                ${product.price_usd}/unit · MOQ {product.moq}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={product.moq}
                value={quantity}
                onChange={(e) => setQuantity(product.id, Number(e.target.value))}
                className="w-24 border-stone-700 bg-stone-950"
              />
              <p className="w-24 text-right font-medium">
                ${(product.price_usd * quantity).toLocaleString()}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(product.id)}
                aria-label="Remove"
              >
                <Trash2 className="size-4 text-stone-500" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col items-end gap-4 border-t border-stone-800 pt-8">
        <p className="text-lg">
          Subtotal{" "}
          <span className="font-semibold text-amber-300">
            ${subtotal().toLocaleString()} USD
          </span>
        </p>
        <ButtonLink href="/checkout" size="lg" className="bg-amber-500 text-stone-950 hover:bg-amber-400">
          Submit wholesale inquiry
        </ButtonLink>
      </div>
    </div>
  );
}
