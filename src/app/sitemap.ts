import type { MetadataRoute } from "next";
import { SITE_URL as SITE } from "@/lib/site";
import { tumModeller } from "@/lib/veri";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const modeller = tumModeller();
  const yollar = new Set<string>([""]);
  for (const m of modeller) {
    yollar.add(`/${m.markaSlug}`);
    yollar.add(`/${m.markaSlug}/${m.modelSlug}`);
    for (const n of m.nesiller) yollar.add(`/${m.markaSlug}/${m.modelSlug}/${n.slug}`);
  }
  return [...yollar].map((y) => ({ url: `${SITE}${y}/` }));
}
