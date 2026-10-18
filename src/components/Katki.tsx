"use client";

import { useEffect, useState } from "react";
import { katkiAcik, oturumAc, supabase } from "@/lib/supabase";
import type { Motor } from "@/lib/tipler";

/** Bir kasadaki sorunların "ben de yaşadım" sayılarını ve ziyaretçinin kendi işaretlerini yönetir. */
export function useDeneyimler(aracAnahtari: string) {
  const [sayilar, setSayilar] = useState<Record<string, number>>({});
  const [benim, setBenim] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!katkiAcik) return;
    let iptal = false;
    (async () => {
      const { data } = await supabase().from("deneyim_sayilari").select("sorun_anahtari, sayi").like("sorun_anahtari", `${aracAnahtari}/%`);
      if (iptal || !data) return;
      setSayilar(Object.fromEntries(data.map((d) => [d.sorun_anahtari, d.sayi])));
      // Sadece daha önce oturum açmış ziyaretçinin işaretleri okunur; sayfayı açmak oturum oluşturmaz.
      const { data: oturum } = await supabase().auth.getSession();
      if (iptal || !oturum.session) return;
      const { data: kendi } = await supabase().from("deneyimler").select("sorun_anahtari").like("sorun_anahtari", `${aracAnahtari}/%`);
      if (!iptal && kendi) setBenim(new Set(kendi.map((d) => d.sorun_anahtari)));
    })();
    return () => {
      iptal = true;
    };
  }, [aracAnahtari]);

  async function degistir(sorunAnahtari: string) {
    const isaretli = benim.has(sorunAnahtari);
    // Arayüz hemen güncellenir, istek başarısız olursa geri alınır.
    const uygula = (ekle: boolean) => {
      setBenim((b) => {
        const y = new Set(b);
        if (ekle) y.add(sorunAnahtari);
        else y.delete(sorunAnahtari);
        return y;
      });
      setSayilar((s) => ({ ...s, [sorunAnahtari]: Math.max(0, (s[sorunAnahtari] ?? 0) + (ekle ? 1 : -1)) }));
    };
    uygula(!isaretli);
    try {
      await oturumAc();
      const { error } = isaretli
        ? await supabase().from("deneyimler").delete().eq("sorun_anahtari", sorunAnahtari)
        : await supabase().from("deneyimler").insert({ sorun_anahtari: sorunAnahtari });
      if (error) throw error;
    } catch {
      uygula(isaretli);
    }
  }

  return { sayilar, benim, degistir };
}

export function YasadimDugmesi({ sayi, isaretli, onClick }: { sayi: number; isaretli: boolean; onClick: () => void }) {
  if (!katkiAcik) return null;
  return (
    <button
      type="button"
      aria-pressed={isaretli}
      onClick={onClick}
      className={`mt-3 cursor-pointer rounded-full border px-3 py-1 text-sm ${
        isaretli ? "border-red-600 bg-red-600 text-white" : "border-zinc-300 hover:border-red-600 dark:border-zinc-700"
      }`}
    >
      {isaretli ? "✓ Ben de yaşadım" : "Ben de yaşadım"}
      {sayi > 0 && <span className="ml-1.5 font-semibold">{sayi}</span>}
    </button>
  );
}

const alanSinifi =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

/** Listede olmayan bir sorunu bildirme formu. Bildirimler incelenmeden sitede görünmez. */
export function SorunBildir({ aracAnahtari, motorlar }: { aracAnahtari: string; motorlar: Motor[] }) {
  const [acik, setAcik] = useState(false);
  const [durum, setDurum] = useState<"bos" | "gonderiliyor" | "tamam" | "hata">("bos");
  const [hata, setHata] = useState("");
  if (!katkiAcik) return null;

  async function gonder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const km = String(f.get("km") ?? "").replace(/\D/g, "");
    setDurum("gonderiliyor");
    try {
      await oturumAc();
      const { error } = await supabase()
        .from("bildirimler")
        .insert({
          arac_anahtari: aracAnahtari,
          motor: String(f.get("motor") ?? "") || null,
          baslik: String(f.get("baslik")).trim(),
          aciklama: String(f.get("aciklama")).trim(),
          km: km ? Number(km) : null,
        });
      if (error) throw error;
      setDurum("tamam");
    } catch (err) {
      const mesaj = err instanceof Error ? err.message : "";
      setHata(mesaj.includes("sınır") ? "Bugün için bildirim sınırına ulaştınız, yarın tekrar deneyin." : "Gönderilemedi, lütfen tekrar deneyin.");
      setDurum("hata");
    }
  }

  if (durum === "tamam") {
    return (
      <p className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
        Teşekkürler, bildiriminiz alındı. Başka kaynaklarla doğrulanırsa listeye eklenecek.
      </p>
    );
  }

  return (
    <section className="mt-8 rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
      {!acik ? (
        <button type="button" onClick={() => setAcik(true)} className="cursor-pointer text-left font-medium text-red-700 dark:text-red-400">
          Listede olmayan bir sorun mu yaşadınız? Bize bildirin
        </button>
      ) : (
        <form onSubmit={gonder} className="grid gap-3">
          <h2 className="text-lg font-semibold">Sorun bildir</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Bildiriminiz hemen yayınlanmaz. İncelenir ve başka kaynaklarla doğrulanırsa listeye eklenir. Kişisel bilgi yazmayın.
          </p>
          {motorlar.length > 1 && (
            <label className="grid gap-1 text-sm font-medium">
              Motor
              <select name="motor" className={alanSinifi} defaultValue="">
                <option value="">Bilmiyorum</option>
                {motorlar.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.ad}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="grid gap-1 text-sm font-medium">
            Sorun
            <input name="baslik" required minLength={5} maxLength={120} placeholder="ör. Soğukta marş güç alıyor" className={alanSinifi} />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Ne oldu?
            <textarea
              name="aciklama"
              required
              minLength={20}
              maxLength={2000}
              rows={4}
              placeholder="Belirtiler, servisin teşhisi, yapılan tamir ve maliyet"
              className={alanSinifi}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Kaçıncı km&apos;de? (isteğe bağlı)
            <input name="km" inputMode="numeric" maxLength={9} placeholder="ör. 85000" className={alanSinifi} />
          </label>
          {durum === "hata" && <p className="text-sm text-red-700 dark:text-red-400">{hata}</p>}
          <button
            type="submit"
            disabled={durum === "gonderiliyor"}
            className="cursor-pointer rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700 disabled:bg-zinc-400"
          >
            {durum === "gonderiliyor" ? "Gönderiliyor..." : "Gönder"}
          </button>
        </form>
      )}
    </section>
  );
}
