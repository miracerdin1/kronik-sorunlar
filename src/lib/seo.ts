import type { Metadata } from "next";
import { SITE_URL } from "./site";

export const SITE_ADI = "Kronik Sorunlar";

/** Sayfa başlığı, açıklaması, kanonik adresi ve paylaşım (Open Graph) etiketleri. */
export function sayfaMeta({ baslik, aciklama, yol }: { baslik: string; aciklama: string; yol: string }): Metadata {
  return {
    title: baslik,
    description: aciklama,
    alternates: { canonical: yol },
    openGraph: { title: baslik, description: aciklama, url: yol, siteName: SITE_ADI, locale: "tr_TR", type: "website" },
  };
}

/** Google'ın sayfa yolunu (breadcrumb) göstermesi için BreadcrumbList verisi. */
export function kirintiVerisi(adimlar: { ad: string; yol: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: adimlar.map((a, i) => ({ "@type": "ListItem", position: i + 1, name: a.ad, item: `${SITE_URL}${a.yol}` })),
  };
}
