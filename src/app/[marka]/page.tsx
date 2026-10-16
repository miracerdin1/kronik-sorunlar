import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { markaModelleri, tumModeller } from "@/lib/veri";

// Yalnızca veride olan araçların sayfaları üretilir; diğer adresler 404 döner.
export const dynamicParams = false;

export function generateStaticParams() {
  return [...new Set(tumModeller().map((m) => m.markaSlug))].map((marka) => ({ marka }));
}

export async function generateMetadata({ params }: PageProps<"/[marka]">): Promise<Metadata> {
  const { marka } = await params;
  const ad = markaModelleri(marka)[0]?.marka;
  return { title: `${ad} kronik sorunları`, description: `${ad} modellerinin kronik sorunları, kasa ve motor bazında.` };
}

export default async function MarkaSayfasi({ params }: PageProps<"/[marka]">) {
  const { marka } = await params;
  const modeller = markaModelleri(marka);
  if (modeller.length === 0) notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold">{modeller[0].marka} kronik sorunları</h1>
      <ul className="mt-6 grid gap-3">
        {modeller.map((m) => (
          <li key={m.modelSlug}>
            <h2 className="text-xl font-semibold">
              <Link href={`/${m.markaSlug}/${m.modelSlug}`} className="hover:text-red-600">
                {m.marka} {m.model}
              </Link>
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{m.nesiller.map((n) => `${n.ad} (${n.yillar[0]}–${n.yillar[1]})`).join(" · ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
