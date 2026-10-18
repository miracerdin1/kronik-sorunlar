import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SorunListesi from "@/components/SorunListesi";
import JsonLd from "@/components/JsonLd";
import { kirintiVerisi, sayfaMeta } from "@/lib/seo";
import { modelBul, tumModeller } from "@/lib/veri";

// Yalnızca veride olan araçların sayfaları üretilir; diğer adresler 404 döner.
export const dynamicParams = false;

export function generateStaticParams() {
  return tumModeller().flatMap((m) => m.nesiller.map((n) => ({ marka: m.markaSlug, model: m.modelSlug, nesil: n.slug })));
}

async function bul(params: PageProps<"/[marka]/[model]/[nesil]">["params"]) {
  const { marka, model, nesil } = await params;
  const m = modelBul(marka, model);
  const n = m?.nesiller.find((x) => x.slug === nesil);
  return m && n ? { m, n } : null;
}

export async function generateMetadata({ params }: PageProps<"/[marka]/[model]/[nesil]">): Promise<Metadata> {
  const sonuc = await bul(params);
  if (!sonuc) return {};
  const { m, n } = sonuc;
  const motorlar = n.motorlar.map((x) => x.ad).join(", ");
  return sayfaMeta({
    baslik: `${m.marka} ${n.ad} ${n.yillar[0]}–${n.yillar[1]} kronik sorunları`,
    aciklama: `${m.marka} ${n.ad} (${motorlar}) kronik sorunları: ${n.sorunlar
      .slice(0, 3)
      .map((s) => s.baslik.toLocaleLowerCase("tr"))
      .join(", ")} ve daha fazlası.`,
    yol: `/${m.markaSlug}/${m.modelSlug}/${n.slug}/`,
  });
}

export default async function NesilSayfasi({ params }: PageProps<"/[marka]/[model]/[nesil]">) {
  const sonuc = await bul(params);
  if (!sonuc) notFound();
  const { m, n } = sonuc;

  return (
    <div>
      <JsonLd
        veri={kirintiVerisi([
          { ad: m.marka, yol: `/${m.markaSlug}/` },
          { ad: m.model, yol: `/${m.markaSlug}/${m.modelSlug}/` },
          { ad: n.ad, yol: `/${m.markaSlug}/${m.modelSlug}/${n.slug}/` },
        ])}
      />
      <nav className="text-sm text-zinc-500 dark:text-zinc-400">
        <Link href={`/${m.markaSlug}`} className="hover:underline">
          {m.marka}
        </Link>
        {" / "}
        <Link href={`/${m.markaSlug}/${m.modelSlug}`} className="hover:underline">
          {m.model}
        </Link>
      </nav>
      <h1 className="mt-1 text-3xl font-bold">
        {m.marka} {n.ad} kronik sorunları
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        {n.yillar[0]}–{n.yillar[1]} model yılları · {n.motorlar.map((x) => x.ad).join(", ")}
      </p>
      {n.not && (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
          {n.not}
        </p>
      )}
      <div className="mt-6">
        <SorunListesi nesil={n} />
      </div>
    </div>
  );
}
