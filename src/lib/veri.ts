import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { KatalogMarka, Model, Nesil, Yakit } from "./tipler";

const VERI_KLASORU = path.join(process.cwd(), "data");

let onbellek: Model[] | null = null;

/** data/<marka>/<model>.json dosyalarının hepsini okur. */
export function tumModeller(): Model[] {
  if (onbellek) return onbellek;
  const modeller: Model[] = [];
  for (const marka of fs.readdirSync(VERI_KLASORU)) {
    const klasor = path.join(VERI_KLASORU, marka);
    if (!fs.statSync(klasor).isDirectory()) continue;
    for (const dosya of fs.readdirSync(klasor)) {
      if (!dosya.endsWith(".json")) continue;
      modeller.push(JSON.parse(fs.readFileSync(path.join(klasor, dosya), "utf8")));
    }
  }
  modeller.sort((a, b) => a.marka.localeCompare(b.marka, "tr") || a.model.localeCompare(b.model, "tr"));
  onbellek = modeller;
  return modeller;
}

export function modelBul(markaSlug: string, modelSlug: string): Model | undefined {
  return tumModeller().find((m) => m.markaSlug === markaSlug && m.modelSlug === modelSlug);
}

export function markaModelleri(markaSlug: string): Model[] {
  return tumModeller().filter((m) => m.markaSlug === markaSlug);
}

export function nesilYakitlari(nesil: Nesil): Yakit[] {
  return [...new Set(nesil.motorlar.map((m) => m.yakit))];
}

export function katalog(): KatalogMarka[] {
  const markalar = new Map<string, KatalogMarka>();
  for (const m of tumModeller()) {
    const marka = markalar.get(m.markaSlug) ?? { ad: m.marka, slug: m.markaSlug, modeller: [] };
    marka.modeller.push({
      ad: m.model,
      slug: m.modelSlug,
      nesiller: m.nesiller.map((n) => ({ slug: n.slug, ad: n.ad, yillar: n.yillar, yakitlar: nesilYakitlari(n) })),
    });
    markalar.set(m.markaSlug, marka);
  }
  return [...markalar.values()];
}
