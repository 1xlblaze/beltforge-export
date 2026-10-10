"use client";

import Link from "next/link";
import { Globe2, Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button, ButtonLink, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/store/cart";
import { Badge } from "@/components/ui/badge";

const nav = [
  { href: "/shop", label: "Wholesale catalog" },
  { href: "/export", label: "International export" },
  { href: "/about", label: "Our atelier" },
];

export function Header() {
  const lines = useCart((s) => s.lines);
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-stone-50">
          <Globe2 className="size-5 text-amber-400" aria-hidden />
          BeltForge Export
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-stone-300 transition hover:text-amber-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href="/export"
            variant="outline"
            size="sm"
            className="hidden border-amber-500/40 bg-transparent text-amber-100 hover:bg-amber-500/10 sm:inline-flex"
          >
            Get export quote
          </ButtonLink>
          <Link
            href="/cart"
            aria-label="Cart"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "relative text-stone-100 hover:bg-white/10",
            )}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <Badge
                className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full bg-amber-500 px-1 text-[10px] text-stone-950"
              >
                {count > 99 ? "99+" : count}
              </Badge>
            )}
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="text-stone-100 md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-stone-800 bg-stone-950">
              <nav className="mt-8 flex flex-col gap-4">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-lg text-stone-200"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/cart" onClick={() => setOpen(false)} className="text-lg text-stone-200">
                  Cart
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
