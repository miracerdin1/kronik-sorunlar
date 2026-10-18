"use client";

import { useState } from "react";
import Link from "next/link";

export interface AramaKaydi {
  href: string;
  marka: string;
  model: string;
  ad: string;
  yillar: [number, number];
  sorunlar: string[];
}

/** Türkçe karakterleri ve büyük harfleri yok sayarak karşılaştırmak için. */
function sade(metin: string) {
  return metin
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Her kelime araç adında, yıl aralığında ya da bir sorun başlığında geçmeli. */
function eslestir(k: AramaKaydi, kelimeler: string[]) {
  const arac = sade(`${k.marka} ${k.model} ${k.ad}`);
  const sorunlar = k.sorunlar.map(sade);
  const eslesenSorunlar = new Set<number>();
  for (const kelime of kelimeler) {
    if (arac.includes(kelime)) continue;
    if (/^(19|20)\d\d$/.test(kelime) && k.yillar[0] <= +kelime && +kelime <= k.yillar[1]) continue;
    const bulunan = sorunlar.flatMap((s, i) => (s.includes(kelime) ? [i] : []));
    if (bulunan.length === 0) return null;
    bulunan.forEach((i) => eslesenSorunlar.add(i));
  }
  return [...eslesenSorunlar].map((i) => k.sorunlar[i]);
}

export default function AracArama({ kayitlar }: { kayitlar: AramaKaydi[] }) {
  const [sorgu, setSorgu] = useState("");
  const kelimeler = sade(sorgu).split(" ").filter(Boolean);
  const sonuclar = kayitlar.flatMap((k) => {
    const sorunlar = eslestir(k, kelimeler);
    return sorunlar ? [{ k, sorunlar }] : [];
  });

  return (
    <div>
      <label className="grid gap-1 text-sm font-medium">
        Model, yıl ya da arıza ara
        <input
          type="search"
          value={sorgu}
          onChange={(e) => setSorgu(e.target.value)}
          placeholder="ör. egea 2018, golf dsg, triger zinciri"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </label>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400" aria-live="polite">
        {kelimeler.length > 0 ? `${sonuclar.length} kasa bulundu` : `${kayitlar.length} kasa`}
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {sonuclar.map(({ k, sorunlar }) => (
          <li key={k.href}>
            <Link
              href={k.href}
              className="block h-full rounded-lg border border-zinc-200 bg-white px-4 py-3 hover:border-red-600 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="font-medium">
                {k.marka} {k.ad}
              </span>
              <span className="block text-sm text-zinc-500 dark:text-zinc-400">
                {k.yillar[0]}–{k.yillar[1]} · {k.sorunlar.length} sorun
              </span>
              {sorunlar.slice(0, 2).map((s) => (
                <span key={s} className="mt-1 block text-sm text-red-700 dark:text-red-400">
                  {s}
                </span>
              ))}
            </Link>
          </li>
        ))}
      </ul>
      {kelimeler.length > 0 && sonuclar.length === 0 && (
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">Eşleşen araç ya da arıza bulunamadı. Farklı bir kelime deneyin.</p>
      )}
    </div>
  );
}
