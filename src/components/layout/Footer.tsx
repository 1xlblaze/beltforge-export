import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-stone-950 text-stone-400">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-semibold text-stone-100">BeltForge Export</p>
          <p className="mt-2 text-sm leading-relaxed">
            Belts-only wholesale export. FOB-ready documentation, MOQ-friendly lines, and regional
            support for international retail partners.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-stone-200">Export desk</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>export@beltforge.example</li>
            <li>+91 98765 43210</li>
            <li>Mon–Sat, 9:00–18:00 IST</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-stone-200">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:text-amber-300">Catalog</Link>
            </li>
            <li>
              <Link href="/export" className="hover:text-amber-300">Export calculator</Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-amber-300">Submit inquiry</Link>
            </li>
          </ul>
        </div>
      </div>
      <Separator className="bg-white/10" />
      <p className="py-6 text-center text-xs text-stone-500">
        © 2026 BeltForge Export. HS 4203.30 — leather articles of apparel.
      </p>
    </footer>
  );
}
