"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { yakitAdi, type KatalogMarka, type Yakit } from "@/lib/tipler";

const secimSinifi =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:disabled:bg-zinc-800";

export default function AracSecici({ katalog }: { katalog: KatalogMarka[] }) {
  const router = useRouter();
  const [markaSlug, setMarkaSlug] = useState("");
  const [modelSlug, setModelSlug] = useState("");
  const [yil, setYil] = useState("");
  const [nesilSlug, setNesilSlug] = useState("");
  const [yakit, setYakit] = useState<Yakit | "">("");

  const marka = katalog.find((m) => m.slug === markaSlug);
  const model = marka?.modeller.find((m) => m.slug === modelSlug);

  const yilKumesi = new Set<number>();
  for (const n of model?.nesiller ?? []) for (let y = n.yillar[0]; y <= n.yillar[1]; y++) yilKumesi.add(y);
  const yillar = [...yilKumesi].sort((a, b) => b - a);

  // Geçiş yıllarında (ör. 2018) iki nesil birden eşleşebilir; o zaman kullanıcıya sorulur.
  const eslesenNesiller = model?.nesiller.filter((n) => yil && n.yillar[0] <= +yil && +yil <= n.yillar[1]) ?? [];
  const nesil = eslesenNesiller.length === 1 ? eslesenNesiller[0] : eslesenNesiller.find((n) => n.slug === nesilSlug);
  const yakitlar = nesil?.yakitlar ?? [];

  function gonder(e: React.FormEvent) {
    e.preventDefault();
    if (!marka || !model || !nesil) return;
    const sorgu = yakit ? `?yakit=${yakit}` : "";
    router.push(`/${marka.slug}/${model.slug}/${nesil.slug}${sorgu}`);
  }

  return (
    <form onSubmit={gonder} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="grid gap-1 text-sm font-medium">
        Marka
        <select
          className={secimSinifi}
          value={markaSlug}
          onChange={(e) => {
            setMarkaSlug(e.target.value);
            setModelSlug("");
            setYil("");
            setNesilSlug("");
            setYakit("");
          }}
        >
          <option value="">Marka seçin</option>
          {katalog.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.ad}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm font-medium">
        Model
        <select
          className={secimSinifi}
          value={modelSlug}
          disabled={!marka}
          onChange={(e) => {
            setModelSlug(e.target.value);
            setYil("");
            setNesilSlug("");
            setYakit("");
          }}
        >
          <option value="">Model seçin</option>
          {marka?.modeller.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.ad}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm font-medium">
        Model yılı
        <select
          className={secimSinifi}
          value={yil}
          disabled={!model}
          onChange={(e) => {
            setYil(e.target.value);
            setNesilSlug("");
            setYakit("");
          }}
        >
          <option value="">Yıl seçin</option>
          {yillar.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm font-medium">
        Yakıt
        <select
          className={secimSinifi}
          value={yakit}
          disabled={!nesil}
          onChange={(e) => setYakit(e.target.value as Yakit | "")}
        >
          <option value="">Tümü</option>
          {yakitlar.map((y) => (
            <option key={y} value={y}>
              {yakitAdi[y]}
            </option>
          ))}
        </select>
      </label>

      {eslesenNesiller.length > 1 && (
        <label className="grid gap-1 text-sm font-medium sm:col-span-2 lg:col-span-4">
          {yil} yılında iki kasa satıldı, hangisi?
          <select className={secimSinifi} value={nesilSlug} onChange={(e) => setNesilSlug(e.target.value)}>
            <option value="">Kasa seçin</option>
            {eslesenNesiller.map((n) => (
              <option key={n.slug} value={n.slug}>
                {n.ad} ({n.yillar[0]}–{n.yillar[1]})
              </option>
            ))}
          </select>
        </label>
      )}

      <button
        type="submit"
        disabled={!nesil}
        className="rounded-lg bg-red-600 px-4 py-3 text-base font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-300 sm:col-span-2 lg:col-span-4 dark:disabled:bg-zinc-700"
      >
        Kronik sorunları göster
      </button>
    </form>
  );
}
