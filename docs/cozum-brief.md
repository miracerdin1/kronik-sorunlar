# Araştırma görevi: kronik sorunlara çözüm bulma

Sitede bir modelin kronik sorunları zaten listeli (`data/<marka>/<model>.json`). Görevin: bu modeldeki HER sorun için
sahiplerin ve servislerin uyguladığı kalıcı çözümü araştırıp yazmak. Metinler Türkçe, kendi cümlelerinle özet (kopyalama yok).

## Nereye bakılır
- Türk sahip toplulukları: donanimhaber forum (model alt forumları), modele özel Türk forumları (ör. fiatforum, renaultclub,
  focusclub, vwclub, corollaclub vb. — herkese açık olanlar), şikayetvar (firmanın/servisin verdiği çözüm cevapları), arabam.com / otomobil
  blogları, kendi ustalarını anlatan YouTube videoları (açıklaması/başlığı çözümü anlatıyorsa).
- Facebook grupları: giriş gerektirdiği için çoğu okunamaz. Yalnızca girişsiz açılan herkese açık bir gönderi okunabildiyse kaynak yap.
- Uluslararası: model forumları (ör. ford-forums, vwvortex, renault forumları, toyotanation), Reddit (r/MechanicAdvice, model subreddit'leri),
  fiches-auto.fr, drive.co.uk (honestjohn), whatcar, autoexpress, carcomplaints, motor1.
- Üretici teknik servis bültenleri (TSB), NHTSA kayıtları, geri çağırma duyuruları: çözüm "parça revize edildi / yazılım güncellemesi" ise en güçlü kaynak.

## Kurallar
- Her çözüm için GERÇEKTEN açtığın (WebFetch ile okuduğun) sayfaların URL'lerini `kaynaklar`a koy. Tahmini URL yok.
  Kaynak, o sorunun bu kasa/motor (ya da aynı motor/şanzıman) için çözümünü gerçekten anlatmalı.
- Amaç her çözüm için en az 2 FARKLI ve BAĞIMSIZ alan adı. Zayıf kaynaklar tek başına yetmez: araclo.com, carchecker.pro, au7o.io,
  carverif.fr, bilgiyerim.com.tr, parcabizden.com, autodoc.co.uk, autopartspro.co.uk, europremiumparts.com, kfz-dietrich.com (YZ destekli atölye blogu),
  wheelstreet.lt (bayi pazarlama yazısı), reidasofficial.lt (şablon yazı). Aktaran siteler asıl siteyle aynı
  sayılır (carverif → fiches-auto, bilgiyerim/parcabizden → şikayetvar). reddit.com ve youtube.com geçerli alan adıdır.
- Çözüm somut olmalı: hangi parça değişiyor / revize parça numarası / yazılım güncellemesi / hangi bakım önlemi. "Servise götürün" çözüm değildir.
  Revize parça varsa söyle; kalıcı çözüm yoksa bunu açıkça yaz (ör. "parça yenisiyle değişse de tekrarlıyor").
- `onlem`: tekrarlamaması için bakım/kullanım önerisi (ör. yağ değişim aralığını kısaltmak). Kaynakta geçmiyorsa yazma.
- Genel tavsiye yazısı ("vites telini ayarlatın" gibi modele özgü olmayan) ve yalnızca zayıf kaynağa dayanan çözüm yazılmaz.
- Kaynak başka modelden olabilir ama AYNI motor/şanzıman olmalı ve o neslin yıllarına uymalı (ör. 2009'da kapanan bir sorunun düzeltmesi 2013 sonrası kasaya yazılmaz).
- Güvenilir bir çözüm bulamadığın sorunu atla (`cozum` ekleme). Az ama doğru tercih edilir.
- Sorunların başlık/belirti/kaynaklarına dokunma; yalnızca `cozum` ekle.

## Çıktı
`<scratchpad>/cozum/<markaSlug>-<modelSlug>.json` dosyasına şu biçimde yaz (yalnızca çözüm bulunan sorunlar):

```json
{
  "markaSlug": "fiat", "modelSlug": "egea",
  "cozumler": [
    {
      "nesil": "356", "sorun": "sorun-id",
      "metin": "Kalıcı çözüm, 1-3 cümle.",
      "onlem": "İsteğe bağlı önleyici bakım, 1 cümle.",
      "kaynaklar": ["https://...", "https://..."]
    }
  ]
}
```
Son mesajında: dosya yolu, kaç çözüm, hangileri 2+ farklı alan adlı, Facebook'a erişip erişemediğin, emin olamadığın noktalar (kısa).
