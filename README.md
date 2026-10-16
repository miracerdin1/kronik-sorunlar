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

Canlı adres için `NEXT_PUBLIC_SITE_URL` ortam değişkenini ayarlayın.
