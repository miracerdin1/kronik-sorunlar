# Kronik sorunlara çözüm ekleme (yeni oturum için kısa rehber)

Her sorunun isteğe bağlı bir `cozum` alanı var: `{ "metin", "onlem"?, "kaynaklar" }`. Doğrulama (yeşil tik) `src/lib/dogrulama.ts`
ile hesaplanır, JSON'a `guven` yazılmaz.

1. Turdaki her model için bir araştırma ajanı başlat; `docs/cozum-brief.md` kurallarını ver, çıktı scratchpad/cozum/<marka>-<model>.json.
2. Çıktıyı gözden geçir: yalnızca zayıf kaynaklı, genel tavsiye niteliğinde, başka nesle/motora ait çözümleri çıkar. Yeni bir zayıf site
   görürsen `ZAYIF_KAYNAKLAR`a ve brief'e ekle. Sonra `cozum`u ilgili sorunun içine yaz (başka alana dokunma).
3. `npm run veri:kontrol`, `npm run lint`, `npx tsc --noEmit`, `npm run build`; commit ve main'e push (Netlify yayınlar).
4. Bitirilen modelleri aşağıdaki listeden sil.

Commit yazarı miracerdin1; Co-Authored-By veya Claude satırı ekleme. Facebook grupları giriş istediği için çoğunlukla okunamıyor.

## Tamamlananlar
Egea, Clio, Megane, Corolla, Focus, Passat (tur 1). Golf, Polo, Astra, Corsa, i20, Duster, Egea DPF (tur 2).

## Sıradakiler
Kalan modeller `data/` altındaki sırayla; popüler olanlar önce: Jetta, Tiguan, Accent, Elantra, Tucson,
Sandero, Logan, 208, 301, 2008, 3008, Linea, Doblo, C-Elysee, Civic, Kuga, Fiesta, Octavia, Superb, Leon, Ibiza, Qashqai,
Juke, Sportage, Ceed, Rio, ve diğerleri.

Not: dev./stage1-/wp-json gibi kanonik olmayan adresleri ayıkla. Sahiplerin sürüşle uyguladığı pratik çözümler (ör. DPF için belirli
viteste/devirde sürüş) Miraç'ın isteğiyle kapsamda.
