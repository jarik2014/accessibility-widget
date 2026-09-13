# WordPress

> ⚠️ **Henüz gerçek bir WordPress ortamında test edilmedi.** Aşağıdaki kurulum adımları
> mimari olarak doğru (same-origin HTML embed, Wix/Webflow/İkas ile aynı yöntem) ama
> Wordfence, iThemes Security, Gutenberg "Custom HTML" sanitizer'ı gibi WordPress'e özgü
> etkenlerle canlı doğrulama yapılmadı — hata çıkabilir. Detay ve takip: [#39](https://github.com/tariktunc/accessibility-widget/issues/39).

Docs-only destek — bkz. [ADR-007](../adr/007-wordpress-support.md). wp.org plugin'i
şu an için yapılmıyor; Custom Element snippet zaten same-origin her HTML bağlamında
çalışıyor (Wix/Webflow/İkas ile aynı mimari).

## Kurulum — Insert Headers and Footers eklentisi (önerilen)

Çoğu WordPress sitesi tema dosyalarına doğrudan erişime izin vermez. Widely-used
**"Insert Headers and Footers"** (veya **"WPCode"**) eklentisini kurun, ardından
eklentinin "Footer" (`</body>` öncesi) alanına şu snippet'i yapıştırın:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@blakfy/accessibility-widget@2.0.0-alpha.0/dist/widget-element.js"
></script>
<blakfy-a11y locale="tr" theme="auto" position="bottom-left"></blakfy-a11y>
```

## Kurulum — tema dosyası (gelişmiş)

Kendi temanızın `footer.php` dosyasını düzenleyebiliyorsanız, aynı snippet'i
`wp_footer()` hook'unun çalıştığı alanda, `</body>` etiketinden önce ekleyin.

## Bilinen riskler

Güvenlik eklentileri (Wordfence, iThemes Security) ve Gutenberg'in "Custom HTML"
bloğu sanitizer'ı script tag'ini kaldırabilir veya kısıtlayıcı bir CSP header ekleyebilir.
Bu **doğrulanmadı** — gerçek bir WordPress kurulumu + eklenti kombinasyonunda test
edilmesi gerekiyor, ayrı olarak [#39](https://github.com/tariktunc/accessibility-widget/issues/39)'da takip ediliyor.

## Mevcut WordPress eklentileriyle birlikte kullanım

"WP Accessibility" gibi yerel WordPress eklentileri ile çakışma yaşanmaz. Bu widget
onların yerini almaz — ayrı bir kullanıcı-tercihleri katmanıdır (bkz. projenin
"asla overlay olamaz" felsefesi, [`CONTRIBUTING.md`](../../.github/CONTRIBUTING.md)).
İki sistem aynı sayfada bağımsız çalışabilir.
