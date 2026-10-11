"use client";

import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const BeltScene = dynamic(
  () => import("@/components/3d/BeltScene").then((m) => m.BeltScene),
  { ssr: false, loading: () => <div className="absolute inset-0 -z-10 bg-stone-950" /> },
);

export function HeroSection() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      <BeltScene />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-950/70 to-stone-950" />
      <div className="relative mx-auto flex max-w-6xl flex-col justify-center px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-400/90">
          BeltForge · Designer belts for export
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-stone-50 sm:text-5xl lg:text-6xl">
          Export crafted belts to retailers{" "}
          <span className="text-amber-300">outside your country</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-stone-300">
          A belts-only wholesale platform with explodable 3D anatomy on every SKU—inspect materials,
          hardware, and lining before you submit an international inquiry.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink
            href="/shop"
            size="lg"
            className="pointer-events-auto bg-amber-500 text-stone-950 hover:bg-amber-400"
          >
            Browse belt catalogue
            <ArrowRight className="ml-2 size-4" />
          </ButtonLink>
          <ButtonLink
            href="/export"
            size="lg"
            variant="outline"
            className="pointer-events-auto border-stone-600 bg-stone-950/50 text-stone-100"
          >
            Calculate landed cost
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
