# Yeni araç ekleme (yeni oturum için kısa rehber)

1. Her model için bir araştırma ajanı başlat; `docs/arastirma-brief.md` kurallarını ver, çıktıyı scratchpad/arac/<marka>-<model>.json'a yazdırsın.
2. Raporları incele, data/<markaSlug>/<modelSlug>.json'a taşı. Çıkar: tek seferlik geri çağırmalar, yalnızca zayıf kaynaklı maddeler, başka nesle/kardeş modele ait kaynaklar, Türkiye'de geçerliliği doğrulanmamış maddeler, yılsız TL fiyatları. `guven` alanını sil.
3. `npm run veri:kontrol`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.
4. Commit ve push (main -> Netlify otomatik yayınlar).

Önemli: Commit yazarı miracerdin1 olmalı; Co-Authored-By, Claude satırı veya "Generated with Claude Code" ekleme (kullanıcı kuralı).
Henüz eklenmeyen fikirler: Picanto (güvenilir kaynak çıkmadı), Audi A3 8P, Hilux eski nesil.
