"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useCart } from "@/store/cart";

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const add = useCart((s) => s.add);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-stone-800 bg-stone-900/60 text-stone-100">
        <CardHeader className="p-0">
          <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {product.featured && (
              <Badge className="absolute left-3 top-3 bg-amber-500 text-stone-950">
                Featured
              </Badge>
            )}
          </Link>
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
            <p className="shrink-0 text-sm font-medium text-amber-300">
              ${product.price_usd}
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
    </motion.div>
  );
}
