"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ciddiyetAdi, yakitAdi, type Ciddiyet, type Nesil, type Sorun } from "@/lib/tipler";

const ciddiyetSirasi: Record<Ciddiyet, number> = { yuksek: 0, orta: 1, dusuk: 2 };

const ciddiyetRozeti: Record<Ciddiyet, string> = {
  yuksek: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  orta: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  dusuk: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

function alanAdi(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function SorunKarti({ sorun, motorAdlari }: { sorun: Sorun; motorAdlari: string }) {
  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-lg font-semibold">{sorun.baslik}</h3>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ciddiyetRozeti[sorun.ciddiyet]}`}>
          {ciddiyetAdi[sorun.ciddiyet]} ciddiyet
        </span>
      </div>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {sorun.parca} · {motorAdlari}
        {sorun.sanziman ? ` · yalnızca ${sorun.sanziman}` : ""}
      </p>
      <p className="mt-3">
        <span className="font-medium">Belirtiler: </span>
        {sorun.belirtiler}
      </p>
      {sorun.not && <p className="mt-2 text-zinc-700 dark:text-zinc-300">{sorun.not}</p>}
      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <div>
          <dt className="inline text-zinc-500 dark:text-zinc-400">Görüldüğü km: </dt>
          <dd className="inline">{sorun.km ?? "Belirsiz"}</dd>
        </div>
        <div>
          <dt className="inline text-zinc-500 dark:text-zinc-400">Tahmini maliyet: </dt>
          <dd className="inline">{sorun.maliyetTl ? `${sorun.maliyetTl} TL` : "Henüz veri yok"}</dd>
        </div>
        <div>
          <dt className="inline text-zinc-500 dark:text-zinc-400">Güven: </dt>
          <dd className="inline">{sorun.guven === "yuksek" ? "Birden çok kaynakta doğrulandı" : "Tek kaynak"}</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm">
        <span className="text-zinc-500 dark:text-zinc-400">Kaynaklar: </span>
        {sorun.kaynaklar.map((k, i) => (
          <span key={k}>
            {i > 0 && ", "}
            <a href={k} target="_blank" rel="noopener noreferrer nofollow" className="text-red-700 underline dark:text-red-400">
              {alanAdi(k)}
            </a>
          </span>
        ))}
      </p>
    </li>
  );
}

export default function SorunListesi({ nesil }: { nesil: Nesil }) {
  const pathname = usePathname();
  const parametreler = useSearchParams();
  const yakit = parametreler.get("yakit");
  const motorId = parametreler.get("motor");

  const motorlar = yakit ? nesil.motorlar.filter((m) => m.yakit === yakit) : nesil.motorlar;
  const seciliMotorlar = motorId ? motorlar.filter((m) => m.id === motorId) : motorlar;
  const seciliIdler = new Set(seciliMotorlar.map((m) => m.id));

  const sorunlar = nesil.sorunlar
    .filter((s) => s.motorlar === "hepsi" || s.motorlar.some((id) => seciliIdler.has(id)))
    .sort((a, b) => ciddiyetSirasi[a.ciddiyet] - ciddiyetSirasi[b.ciddiyet]);

  const motorAdi = (s: Sorun) =>
    s.motorlar === "hepsi"
      ? "Tüm motorlar"
      : s.motorlar.map((id) => nesil.motorlar.find((m) => m.id === id)?.ad ?? id).join(", ");

  const baglanti = (motor?: string) => {
    const p = new URLSearchParams();
    if (yakit) p.set("yakit", yakit);
    if (motor) p.set("motor", motor);
    const s = p.toString();
    return s ? `${pathname}?${s}` : pathname;
  };

  const yakitlar = [...new Set(nesil.motorlar.map((m) => m.yakit))];

  return (
    <section>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">Yakıt:</span>
        <Link
          href={pathname}
          className={`rounded-full border px-3 py-1 text-sm ${!yakit ? "border-red-600 bg-red-600 text-white" : "border-zinc-300 dark:border-zinc-700"}`}
        >
          Tümü
        </Link>
        {yakitlar.map((y) => (
          <Link
            key={y}
            href={`${pathname}?yakit=${y}`}
            className={`rounded-full border px-3 py-1 text-sm ${yakit === y ? "border-red-600 bg-red-600 text-white" : "border-zinc-300 dark:border-zinc-700"}`}
          >
            {yakitAdi[y]}
          </Link>
        ))}
      </div>

      {motorlar.length > 1 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Motor:</span>
          <Link
            href={baglanti()}
            className={`rounded-full border px-3 py-1 text-sm ${!motorId ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900" : "border-zinc-300 dark:border-zinc-700"}`}
          >
            Tümü
          </Link>
          {motorlar.map((m) => (
            <Link
              key={m.id}
              href={baglanti(m.id)}
              className={`rounded-full border px-3 py-1 text-sm ${motorId === m.id ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900" : "border-zinc-300 dark:border-zinc-700"}`}
            >
              {m.ad}
            </Link>
          ))}
        </div>
      )}

      {motorlar.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-zinc-300 p-6 text-center text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          Bu kasa için {yakit && yakit in yakitAdi ? yakitAdi[yakit as keyof typeof yakitAdi].toLowerCase() : "bu yakıt"} motor
          verisi henüz eklenmedi.
        </p>
      ) : (
        <>
          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">{sorunlar.length} kronik sorun, ciddiyete göre sıralı</p>
          <ul className="mt-3 grid gap-4">
            {sorunlar.map((s) => (
              <SorunKarti key={s.id} sorun={s} motorAdlari={motorAdi(s)} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
