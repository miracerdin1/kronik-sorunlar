import type { Guven } from "./tipler";

/**
 * Kendi başına doğrulama sayılmayan kaynaklar: içeriği büyük ölçüde otomatik
 * üretilmiş ya da başka sitelerden derlenmiş siteler. Bunlar ikinci bir bağımsız
 * kaynağı destekleyebilir ama tek başlarına bir sorunu "doğrulandı" yapamaz.
 */
export const ZAYIF_KAYNAKLAR = ["araclo.com", "carchecker.pro", "au7o.io", "carverif.fr", "bilgiyerim.com.tr", "parcabizden.com"];

/**
 * Verisini açıkça başka bir siteden aktaran kaynaklar. Bağımsız sayılmazlar:
 * kaynak sayılırken asıl siteyle aynı kaynak kabul edilir (ör. carverif.fr fiches-auto.fr
 * sayılarını, bilgiyerim/parcabizden şikayetvar şikayetlerini yeniden yazıyor).
 */
const AKTARAN_KAYNAKLAR: Record<string, string> = {
  "carverif.fr": "fiches-auto.fr",
  "bilgiyerim.com.tr": "sikayetvar.com",
  "parcabizden.com": "sikayetvar.com",
};

export function alanAdi(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "");
}

export function zayifMi(url: string): boolean {
  const alan = alanAdi(url);
  return ZAYIF_KAYNAKLAR.some((z) => alan === z || alan.endsWith(`.${z}`));
}

/** En az iki farklı siteden, en az biri güçlü kaynaktan gelen sorun doğrulanmış sayılır. */
export function guvenHesapla(kaynaklar: string[]): Guven {
  const alanlar = new Set(kaynaklar.map((k) => AKTARAN_KAYNAKLAR[alanAdi(k)] ?? alanAdi(k)));
  const gucluVar = kaynaklar.some((k) => !zayifMi(k));
  return alanlar.size >= 2 && gucluVar ? "dogrulandi" : "tek-kaynak";
}
