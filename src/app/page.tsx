import AracArama from "@/components/AracArama";
import AracSecici from "@/components/AracSecici";
import { katalog, tumModeller } from "@/lib/veri";

export default function Home() {
  const modeller = tumModeller();
  const kasaSayisi = modeller.reduce((t, m) => t + m.nesiller.length, 0);
  const sorunSayisi = modeller.reduce((t, m) => t + m.nesiller.reduce((u, n) => u + n.sorunlar.length, 0), 0);

  return (
    <div className="grid gap-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Aracınızın kronik sorunlarını öğrenin</h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
          Marka, model, yıl ve yakıt tipini seçin. O araca özgü bilinen arızaları belirtileri ve kaynaklarıyla listeleyelim.
        </p>
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <AracSecici katalog={katalog()} />
        </div>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          Şu an {modeller.length} model, {kasaSayisi} kasa ve {sorunSayisi} kronik sorun kayıtlı. Liste düzenli olarak genişliyor.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Kayıtlı modeller</h2>
        <div className="mt-3">
          <AracArama
            kayitlar={modeller.flatMap((m) =>
              m.nesiller.map((n) => ({
                href: `/${m.markaSlug}/${m.modelSlug}/${n.slug}`,
                marka: m.marka,
                model: m.model,
                ad: n.ad,
                yillar: n.yillar,
                sorunlar: n.sorunlar.map((s) => s.baslik),
              })),
            )}
          />
        </div>
      </section>
    </div>
  );
}
