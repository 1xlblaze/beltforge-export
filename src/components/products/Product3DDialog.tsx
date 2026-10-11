"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ExplodableBeltViewer = dynamic(
  () =>
    import("@/components/3d/ExplodableBeltViewer").then((m) => m.ExplodableBeltViewer),
  { ssr: false, loading: () => <div className="h-80 animate-pulse rounded-xl bg-stone-900" /> },
);

type Props = {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function Product3DDialog({ product, open, onOpenChange }: Props) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-stone-800 bg-stone-950 text-stone-100 sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-left text-lg">
            3D export belt — {product.name}
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-stone-500">
          Interactive anatomy preview for wholesale buyers—open each layer to review materials
          before export sampling.
        </p>
        <ExplodableBeltViewer product={product} className="mt-4" />
      </DialogContent>
    </Dialog>
  );
}
