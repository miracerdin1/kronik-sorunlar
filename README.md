# Kronik Sorunlar

Türkiye'de satılan araçların kronik sorunlarını marka, model, yıl ve yakıt tipine göre listeleyen site.

## Çalıştırma

```bash
npm install
npm run dev   # http://localhost:3000
```

## Veri

Her model `data/<marka>/<model>.json` dosyasında durur; tipler `src/lib/tipler.ts` içinde.

- Model → nesiller (kasa, yıl aralığı) → motorlar (yakıt) ve sorunlar.
- Sorunun `motorlar` alanı motor id listesi ya da tüm motorlar için `"hepsi"`.
- `guven`: `yuksek` en az iki bağımsız kaynakta geçen, `orta` tek kaynaklı sorun.
- Her sorunun en az bir kaynak linki olmalı; metinler kaynaktan kopyalanmaz, özetlenir.

Yeni bir JSON dosyası eklemek sayfaları, seçim formunu ve `sitemap.xml`'i otomatik günceller.

Vercel'de canlı adres otomatik algılanır; özel alan adı bağlarsanız `NEXT_PUBLIC_SITE_URL` ortam değişkenini ayarlayın.

## Doğrulama kuralı

Bir sorun ancak **en az iki farklı siteden** kaynak gösteriyorsa ve bunlardan **en az biri güçlü kaynak** ise "doğrulandı" sayılır (`src/lib/dogrulama.ts`). İçeriği büyük ölçüde otomatik üretilen siteler (`ZAYIF_KAYNAKLAR`) tek başına doğrulama sayılmaz. Sitede tüm sorunlar listelenir; doğrulanmış olanların başlığında yeşil bir tik ve "Doğrulandı" ipucu bulunur.

```bash
npm run veri:kontrol   # şema hatalarını ve doğrulama bekleyen sorunları listeler
```
