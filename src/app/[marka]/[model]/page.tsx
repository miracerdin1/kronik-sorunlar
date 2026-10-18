import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { kirintiVerisi, sayfaMeta } from "@/lib/seo";
import { modelBul, tumModeller } from "@/lib/veri";
import { yakitAdi } from "@/lib/tipler";

// Yalnızca veride olan araçların sayfaları üretilir; diğer adresler 404 döner.
export const dynamicParams = false;

export function generateStaticParams() {
  return tumModeller().map((m) => ({ marka: m.markaSlug, model: m.modelSlug }));
}

export async function generateMetadata({ params }: PageProps<"/[marka]/[model]">): Promise<Metadata> {
  const { marka, model } = await params;
  const m = modelBul(marka, model);
  if (!m) return {};
  return sayfaMeta({
    baslik: `${m.marka} ${m.model} kronik sorunları`,
    aciklama: `${m.marka} ${m.model} kronik sorunları (${m.nesiller.map((n) => `${n.ad} ${n.yillar[0]}–${n.yillar[1]}`).join(", ")}): kasa ve motora göre arızalar, belirtiler ve kaynaklar.`,
    yol: `/${m.markaSlug}/${m.modelSlug}/`,
  });
}

export default async function ModelSayfasi({ params }: PageProps<"/[marka]/[model]">) {
  const { marka, model } = await params;
  const m = modelBul(marka, model);
  if (!m) notFound();

  return (
    <div>
      <JsonLd
        veri={kirintiVerisi([
          { ad: m.marka, yol: `/${m.markaSlug}/` },
          { ad: m.model, yol: `/${m.markaSlug}/${m.modelSlug}/` },
        ])}
      />
      <nav className="text-sm text-zinc-500 dark:text-zinc-400">
        <Link href={`/${m.markaSlug}`} className="hover:underline">
          {m.marka}
        </Link>
      </nav>
      <h1 className="mt-1 text-3xl font-bold">
        {m.marka} {m.model} kronik sorunları
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">Aracınızın kasasını seçin:</p>
      <ul className="mt-4 grid gap-3">
        {m.nesiller.map((n) => (
          <li key={n.slug}>
            <Link
              href={`/${m.markaSlug}/${m.modelSlug}/${n.slug}`}
              className="block rounded-xl border border-zinc-200 bg-white p-4 hover:border-red-600 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-lg font-semibold">{n.ad}</span>
              <span className="block text-sm text-zinc-500 dark:text-zinc-400">
                {n.yillar[0]}–{n.yillar[1]} · {n.motorlar.map((mo) => `${mo.ad} ${yakitAdi[mo.yakit].toLowerCase()}`).join(", ")} ·{" "}
                {n.sorunlar.length} sorun
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
