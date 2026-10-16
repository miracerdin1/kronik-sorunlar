import type { MetadataRoute } from "next";
import { tumModeller } from "@/lib/veri";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const modeller = tumModeller();
  const yollar = new Set<string>([""]);
  for (const m of modeller) {
    yollar.add(`/${m.markaSlug}`);
    yollar.add(`/${m.markaSlug}/${m.modelSlug}`);
    for (const n of m.nesiller) yollar.add(`/${m.markaSlug}/${m.modelSlug}/${n.slug}`);
  }
  return [...yollar].map((y) => ({ url: `${SITE}${y}` }));
}
