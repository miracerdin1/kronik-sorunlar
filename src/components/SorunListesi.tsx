"use client";

import { useSyncExternalStore } from "react";
import { alanAdi } from "@/lib/dogrulama";
import { SorunBildir, useDeneyimler, YasadimDugmesi } from "@/components/Katki";
import { ciddiyetAdi, yakitAdi, type Ciddiyet, type Cozum, type Nesil, type Sorun } from "@/lib/tipler";

const ciddiyetSirasi: Record<Ciddiyet, number> = { yuksek: 0, orta: 1, dusuk: 2 };

const ciddiyetRozeti: Record<Ciddiyet, string> = {
  yuksek: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  orta: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  dusuk: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

function DogrulandiIsareti({ aciklama = "en az iki bağımsız kaynakta geçiyor" }: { aciklama?: string }) {
  return (
    <span className="group relative inline-flex align-middle">
      <span
        tabIndex={0}
        role="img"
        aria-label="Doğrulandı"
        className="inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full bg-emerald-600 text-white outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
          <path
            fillRule="evenodd"
            d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-56 -translate-x-1/2 rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-normal text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-zinc-100 dark:text-zinc-900"
      >
        Doğrulandı: {aciklama}
      </span>
    </span>
  );
}

function KaynakListesi({ kaynaklar }: { kaynaklar: string[] }) {
  return (
    <p className="mt-3 text-sm">
      <span className="text-zinc-500 dark:text-zinc-400">Kaynaklar: </span>
      {kaynaklar.map((k, i) => (
        <span key={k}>
          {i > 0 && ", "}
          <a href={k} target="_blank" rel="noopener noreferrer nofollow" className="text-red-700 underline dark:text-red-400">
            {alanAdi(k)}
          </a>
        </span>
      ))}
    </p>
  );
}

function CozumKutusu({ cozum }: { cozum: Cozum }) {
  return (
    <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/40">
      <h4 className="font-semibold text-emerald-900 dark:text-emerald-300">
        Çözüm
        {cozum.guven === "dogrulandi" && (
          <>
            {" "}
            <DogrulandiIsareti aciklama="bu çözüm en az iki bağımsız kaynakta geçiyor" />
          </>
        )}
      </h4>
      <p className="mt-1">{cozum.metin}</p>
      {cozum.onlem && (
        <p className="mt-2">
          <span className="font-medium">Önlem: </span>
          {cozum.onlem}
        </p>
      )}
      <KaynakListesi kaynaklar={cozum.kaynaklar} />
    </div>
  );
}

function SorunKarti({ sorun, motorAdlari, yasadim }: { sorun: Sorun; motorAdlari: string; yasadim: React.ReactNode }) {
  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-lg font-semibold">
          {sorun.baslik}
          {sorun.guven === "dogrulandi" && (
            <>
              {" "}
              <DogrulandiIsareti />
            </>
          )}
        </h3>
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
      </dl>
      <KaynakListesi kaynaklar={sorun.kaynaklar} />
      {sorun.cozum && <CozumKutusu cozum={sorun.cozum} />}
      {yasadim}
    </li>
  );
}

// Filtre durumu adres çubuğundaki ?yakit=&motor= parametrelerinde tutulur. Sunucuda (statik HTML)
// filtre yoktur, böylece tüm sorunlar sayfanın HTML'inde yer alır ve arama motorları görebilir.
const FILTRE_OLAYI = "sorun-filtresi";

function abone(bildir: () => void) {
  window.addEventListener("popstate", bildir);
  window.addEventListener(FILTRE_OLAYI, bildir);
  return () => {
    window.removeEventListener("popstate", bildir);
    window.removeEventListener(FILTRE_OLAYI, bildir);
  };
}

function filtreSec(yakit: string | null, motor: string | null) {
  const p = new URLSearchParams();
  if (yakit) p.set("yakit", yakit);
  if (motor) p.set("motor", motor);
  const s = p.toString();
  window.history.replaceState(window.history.state, "", s ? `${window.location.pathname}?${s}` : window.location.pathname);
  window.dispatchEvent(new Event(FILTRE_OLAYI));
}

function Secenek({ secili, koyu, onClick, children }: { secili: boolean; koyu?: boolean; onClick: () => void; children: React.ReactNode }) {
  const seciliSinif = koyu
    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
    : "border-red-600 bg-red-600 text-white";
  return (
    <button
      type="button"
      aria-pressed={secili}
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${secili ? seciliSinif : "border-zinc-300 dark:border-zinc-700"}`}
    >
      {children}
    </button>
  );
}

export default function SorunListesi({ nesil, aracAnahtari }: { nesil: Nesil; aracAnahtari: string }) {
  const deneyim = useDeneyimler(aracAnahtari);
  const arama = useSyncExternalStore(
    abone,
    () => window.location.search,
    () => "",
  );
  const parametreler = new URLSearchParams(arama);
  const yakit = parametreler.get("yakit");
  const motorId = parametreler.get("motor");

  const motorlar = yakit ? nesil.motorlar.filter((m) => m.yakit === yakit) : nesil.motorlar;
  const seciliMotorlar = motorId ? motorlar.filter((m) => m.id === motorId) : motorlar;
  const seciliIdler = new Set(seciliMotorlar.map((m) => m.id));

  const sorunlar = nesil.sorunlar
    .filter((s) => s.motorlar === "hepsi" || s.motorlar.some((id) => seciliIdler.has(id)))
    .sort((a, b) => ciddiyetSirasi[a.ciddiyet] - ciddiyetSirasi[b.ciddiyet]);
  const dogrulananSayisi = sorunlar.filter((s) => s.guven === "dogrulandi").length;

  const motorAdi = (s: Sorun) =>
    s.motorlar === "hepsi"
      ? "Tüm motorlar"
      : s.motorlar.map((id) => nesil.motorlar.find((m) => m.id === id)?.ad ?? id).join(", ");

  const yakitlar = [...new Set(nesil.motorlar.map((m) => m.yakit))];

  return (
    <section>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">Yakıt:</span>
        <Secenek secili={!yakit} onClick={() => filtreSec(null, null)}>
          Tümü
        </Secenek>
        {yakitlar.map((y) => (
          <Secenek key={y} secili={yakit === y} onClick={() => filtreSec(y, null)}>
            {yakitAdi[y]}
          </Secenek>
        ))}
      </div>

      {motorlar.length > 1 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Motor:</span>
          <Secenek koyu secili={!motorId} onClick={() => filtreSec(yakit, null)}>
            Tümü
          </Secenek>
          {motorlar.map((m) => (
            <Secenek key={m.id} koyu secili={motorId === m.id} onClick={() => filtreSec(yakit, m.id)}>
              {m.ad}
            </Secenek>
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
          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
            {sorunlar.length} kronik sorun, ciddiyete göre sıralı · {dogrulananSayisi} tanesi doğrulandı
          </p>
          <ul className="mt-3 grid gap-4">
            {sorunlar.map((s) => (
              <SorunKarti
                key={s.id}
                sorun={s}
                motorAdlari={motorAdi(s)}
                yasadim={
                  <YasadimDugmesi
                    sayi={deneyim.sayilar[`${aracAnahtari}/${s.id}`] ?? 0}
                    isaretli={deneyim.benim.has(`${aracAnahtari}/${s.id}`)}
                    onClick={() => deneyim.degistir(`${aracAnahtari}/${s.id}`)}
                  />
                }
              />
            ))}
          </ul>
        </>
      )}
      <SorunBildir aracAnahtari={aracAnahtari} motorlar={nesil.motorlar} />
    </section>
  );
}
