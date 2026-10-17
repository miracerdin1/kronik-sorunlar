# Araştırma görevi: Türkiye'de satılan bir aracın kronik sorunları

Bir web sitesi için TEK bir araç modelinin (verilen kasa/nesil) kronik sorunlarını derliyorsun. Tüm metinler Türkçe, kendi cümlelerinle özet (kopyalama yok).

## Kurallar
- Her sorun için GERÇEKTEN açtığın (WebFetch ile okuduğun) sayfaların URL'lerini `kaynaklar` listesine koy. Okumadığın ya da tahmin ettiğin URL koyma. Her kaynak sayfa o sorunu o kasa/motor için gerçekten anmalı.
- Amaç: her sorun için en az 2 FARKLI ve BAĞIMSIZ alan adından kaynak. Zayıf kaynaklar (araclo.com, carchecker.pro, au7o.io, carverif.fr, bilgiyerim.com.tr, parcabizden.com) tek başına yetmez; yanında güçlü bir kaynak olmalı. Başka sitenin verisini aktaran siteler (carverif.fr → fiches-auto, bilgiyerim/parcabizden → şikayetvar) asıl siteyle aynı kaynak sayılır; bunlar yerine gerçekten bağımsız bir ikinci kaynak ara. honestjohn.co.uk artık drive.co.uk'ye yönleniyor.
- Kaynak o modelin AYNI kasasından/neslinden bahsetmeli (şikayetvar'da yeni nesil şikayetlerini ayıkla). Motor genel sayfası (aynı motor, başka model) yalnızca motor kaynaklı arızalarda kabul edilir.
- maliyetTl için şikayetin yılı sayfada görünmüyorsa kullanma.
- İyi kaynaklar: fiches-auto.fr güvenilirlik sayfaları (`https://www.fiches-auto.fr/fiabilite-<marka>/fiabilite-<id>-pannes-<marka>-<model>.php`, motor bazlı arıza sayıları — önce sitenin marka sayfasından doğru id'yi bul), sikayetvar.com, donanimhaber forum, arabam.com, arabalar.com.tr, honestjohn.co.uk, whatcar.com, autoexpress, carbuzz, quechoisir, haynes, motor1, kaynaklar yetersizse ADAC Pannenstatistik.
- Tek kaynaklı bir sorunu da yazabilirsin ama ikinci kaynak bulmak için gerçekten ara. Kaynağı hiç olmayan bir şey yazma.
- Yalnızca Türkiye'de satılan motorları ekle (motor listesini Türkiye pazarına göre kur; emin değilsen yaygın olanları al).
- Gerçek bir kronik/tekrarlayan sorun olmalı; tek seferlik bireysel şikayetler değil. 4–8 sorun yeterli; az ama doğru tercih edilir.
- maliyetTl: yalnızca güncel (2024-2026) Türk kaynağında TL fiyat geçiyorsa yaz, yoksa null. km: kaynakta geçiyorsa "80.000-120.000" biçiminde, yoksa null.

## Çıktı
Sonucu şu yola JSON olarak yaz: `<scratchpad>/arac/<markaSlug>-<modelSlug>.json`. Mevcut bir model dosyasına yeni kasa ekleniyorsa yine aynı biçimde tek nesilli bir Model yaz.

```json
{
  "marka": "Hyundai", "markaSlug": "hyundai", "model": "Tucson", "modelSlug": "tucson",
  "nesiller": [{
    "slug": "tucson-tl", "ad": "Tucson (TL)", "yillar": [2015, 2020], "not": null,
    "motorlar": [{"id": "1-6-gdi", "ad": "1.6 GDI", "yakit": "benzin"}],
    "sorunlar": [{
      "id": "kisa-kebap-id", "baslik": "Kısa başlık", "parca": "Parça adı",
      "belirtiler": "Sürücünün fark ettiği belirtiler, bir iki cümle",
      "km": null, "ciddiyet": "yuksek|orta|dusuk", "maliyetTl": null,
      "motorlar": ["1-6-gdi"] veya "hepsi",
      "sanziman": "isteğe bağlı, ör. 7 ileri DCT otomatik",
      "not": "isteğe bağlı kısa açıklama (ör. üretici yazılım güncellemesi / geri çağırma)",
      "kaynaklar": ["https://..."]
    }]
  }]
}
```
yakit değerleri: benzin, dizel, lpg, hibrit, elektrik. id'ler küçük harf-tire. JSON'a `guven` alanı YAZMA.

Son mesajında: dosya yolu, kaç sorun, hangileri 2+ farklı alan adlı, ve emin olamadığın noktalar (kısa).
