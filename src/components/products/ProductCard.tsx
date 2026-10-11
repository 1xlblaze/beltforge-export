"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Box } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Product3DDialog } from "@/components/products/Product3DDialog";
import { useCart } from "@/store/cart";

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const add = useCart((s) => s.add);
  const [viewerOpen, setViewerOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-stone-800 bg-stone-900/60 text-stone-100">
        <CardHeader className="p-0">
          <button
            type="button"
            className="group relative block aspect-[4/5] w-full overflow-hidden text-left"
            onClick={() => setViewerOpen(true)}
            aria-label={`Open 3D belt view for ${product.name}`}
          >
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-stone-950/0 transition group-hover:bg-stone-950/35">
              <span className="flex items-center gap-2 rounded-full bg-stone-950/80 px-3 py-1.5 text-xs font-medium text-amber-200 opacity-0 backdrop-blur transition group-hover:opacity-100">
                <Box className="size-3.5" />
                Open 3D belt layers
              </span>
            </span>
            {product.featured && (
              <Badge className="absolute left-3 top-3 bg-amber-500 text-stone-950">
                Featured
              </Badge>
            )}
          </button>
        </CardHeader>
        <CardContent className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-amber-400/90">
                {product.category}
              </p>
              <Link href={`/shop/${product.slug}`}>
                <h3 className="font-semibold leading-snug hover:text-amber-200">
                  {product.name}
                </h3>
              </Link>
            </div>
            <p className="shrink-0 text-right text-sm font-medium text-amber-300">
              ${product.price_usd}
              {product.price_inr ? (
                <span className="block text-[10px] font-normal text-stone-500">
                  ref ₹{product.price_inr.toLocaleString("en-IN")}
                </span>
              ) : null}
            </p>
          </div>
          <p className="line-clamp-2 text-sm text-stone-400">{product.description}</p>
          <p className="text-xs text-stone-500">MOQ {product.moq} units · Export ready</p>
        </CardContent>
        <CardFooter className="flex gap-2 p-4 pt-0">
          <Button
            className="flex-1 bg-amber-500 text-stone-950 hover:bg-amber-400"
            onClick={() => add(product)}
          >
            Add MOQ to cart
          </Button>
          <ButtonLink href={`/shop/${product.slug}`} variant="outline" className="border-stone-700 bg-transparent">
            Details
          </ButtonLink>
        </CardFooter>
      </Card>
      <Product3DDialog
        product={product}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
      />
    </motion.div>
  );
}
