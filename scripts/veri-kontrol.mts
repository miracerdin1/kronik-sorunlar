// Veri dosyalarını doğrular ve kaynak durumunu raporlar.
// Kullanım: npm run veri:kontrol   (hata varsa çıkış kodu 1)
import fs from "node:fs";
import path from "node:path";
import { alanAdi, guvenHesapla } from "../src/lib/dogrulama.ts";
import type { Model } from "../src/lib/tipler.ts";

const YAKITLAR = ["benzin", "dizel", "lpg", "hibrit", "elektrik"];
const CIDDIYETLER = ["yuksek", "orta", "dusuk"];
const kok = path.join(import.meta.dirname, "..", "data");
const hatalar: string[] = [];
let toplam = 0;
let dogrulanan = 0;
const bekleyenler: string[] = [];

for (const marka of fs.readdirSync(kok)) {
  for (const dosya of fs.readdirSync(path.join(kok, marka))) {
    const yer = `${marka}/${dosya}`;
    const m: Model = JSON.parse(fs.readFileSync(path.join(kok, marka, dosya), "utf8"));
    if (m.markaSlug !== marka || `${m.modelSlug}.json` !== dosya) hatalar.push(`${yer}: slug dosya yoluyla uyuşmuyor`);
    const nesilSluglari = new Set<string>();
    for (const n of m.nesiller) {
      if (nesilSluglari.has(n.slug)) hatalar.push(`${yer}: tekrarlanan kasa ${n.slug}`);
      nesilSluglari.add(n.slug);
      if (n.yillar[0] > n.yillar[1]) hatalar.push(`${yer}/${n.slug}: yıl aralığı ters`);
      const motorIdleri = new Set(n.motorlar.map((x) => x.id));
      for (const mo of n.motorlar) if (!YAKITLAR.includes(mo.yakit)) hatalar.push(`${yer}/${n.slug}: bilinmeyen yakıt ${mo.yakit}`);
      const sorunIdleri = new Set<string>();
      for (const s of n.sorunlar) {
        const ad = `${yer}/${n.slug}/${s.id}`;
        toplam++;
        if (sorunIdleri.has(s.id)) hatalar.push(`${ad}: tekrarlanan sorun id`);
        sorunIdleri.add(s.id);
        if (!CIDDIYETLER.includes(s.ciddiyet)) hatalar.push(`${ad}: bilinmeyen ciddiyet`);
        if (s.motorlar !== "hepsi") for (const id of s.motorlar) if (!motorIdleri.has(id)) hatalar.push(`${ad}: tanımsız motor ${id}`);
        if (!s.kaynaklar?.length) {
          hatalar.push(`${ad}: kaynak yok`);
          continue;
        }
        try {
          if (guvenHesapla(s.kaynaklar) === "dogrulandi") dogrulanan++;
          else bekleyenler.push(`${m.marka} ${n.ad}: ${s.baslik} [${[...new Set(s.kaynaklar.map(alanAdi))].join(", ")}]`);
        } catch {
          hatalar.push(`${ad}: geçersiz kaynak adresi`);
        }
      }
    }
  }
}

console.log(`${toplam} sorun, ${dogrulanan} doğrulandı, ${bekleyenler.length} tek kaynak.`);
if (process.argv.includes("--bekleyenler")) for (const b of bekleyenler) console.log(`  - ${b}`);
if (hatalar.length) {
  console.error(`\n${hatalar.length} hata:\n` + hatalar.map((h) => `  ✗ ${h}`).join("\n"));
  process.exit(1);
}
