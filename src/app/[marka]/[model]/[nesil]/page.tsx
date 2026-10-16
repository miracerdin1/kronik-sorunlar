import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import SorunListesi from "@/components/SorunListesi";
import { modelBul, tumModeller } from "@/lib/veri";

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
  return {
    title: `${m.marka} ${n.ad} ${n.yillar[0]}–${n.yillar[1]} kronik sorunları`,
    description: `${m.marka} ${n.ad} (${motorlar}) kronik sorunları: ${n.sorunlar
      .slice(0, 3)
      .map((s) => s.baslik.toLowerCase())
      .join(", ")} ve daha fazlası.`,
  };
}

export default async function NesilSayfasi({ params }: PageProps<"/[marka]/[model]/[nesil]">) {
  const sonuc = await bul(params);
  if (!sonuc) notFound();
  const { m, n } = sonuc;

  return (
    <div>
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
      <div className="mt-6">
        <Suspense fallback={<p className="text-zinc-500">Yükleniyor…</p>}>
          <SorunListesi nesil={n} />
        </Suspense>
      </div>
    </div>
  );
}
