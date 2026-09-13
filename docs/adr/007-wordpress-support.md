# ADR-007: WordPress Desteği — Docs-Only, Plugin Değil

**Durum**: Kabul edildi
**Tarih**: 2026-09-13
**Karar verici**: Tarık Tunç (Blakfy Studio)

## Bağlam

WordPress web sitelerinin ~%40'ından fazlasını oluşturuyor ama bu repoda hiçbir yerde
adı geçmiyor (#38). Widget'ın Custom Element mimarisi (`<blakfy-a11y>`) zaten same-origin
her HTML bağlamında çalışıyor — Wix/Webflow/İkas için kanıtlanmış aynı mekanizma.

İki seçenek vardı: (a) sadece dokümantasyon (kopyala-yapıştır snippet), (b) wp.org'da
listelenen özel bir plugin.

## Karar

**(a) Docs-only destek.** wp.org plugin'i şimdilik yapılmayacak.

**Gerekçe:**
- Custom Element snippet zaten çalışıyor, ek kod yok
- Plugin geliştirme + wp.org onay süreci + sürüm uyumluluk matrisi = ekstra bakım yükü
- Şu ana kadar gerçek bir talep/blokaj yok
- (b) gerçek talep gelirse ayrı bir issue ile tekrar değerlendirilir

## Sonuç

`docs/guides/wordpress.md` — Insert Headers and Footers eklentisi (önerilen) + tema
dosyası (gelişmiş) olmak üzere iki kurulum yolu dokümante edildi. Güvenlik eklentisi
(Wordfence/iThemes) ve Gutenberg sanitizer riskleri #39'a referans verilerek ayrı
tutuldu — bu ADR o testi kapsamıyor.
