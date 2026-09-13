# Wix, Webflow, Shopify — No-code Platform Entegrasyonu

## Wix

### Doğru embed noktası: Site Settings → Custom Code

Widget'ı **Site Settings → Custom Code** üzerinden ekleyin — bu same-origin bir embed
noktasıdır. Bu, drag-and-drop **"Embed a Widget"** HTML-iframe bloğu İLE AYNI ŞEY
DEĞİLDİR — o blok cross-origin sandboxed bir iframe içinde çalışır ve widget orada
düzgün çalışmaz (bkz. aşağıdaki "Sık yapılan hata").

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@blakfy/accessibility-widget@2.0.0-alpha.0/dist/widget-element.js"></script>

<blakfy-a11y locale="tr" theme="auto" position="bottom-left"></blakfy-a11y>
```

### Sık yapılan hata: sandboxed iframe

Wix'in "Embed a Widget" (drag-and-drop HTML iframe) elementi, yapıştırılan HTML'i
cross-origin sandboxed bir iframe içinde çalıştırır. Bu bağlamda FAB küçük iframe
kutusunun içine hapsolur ve tercihler sessizce kalıcı hale gelmez. Widget bu durumu
tespit edip `window.BlakfyA11y.diagnostics()` üzerinden bir `SANDBOXED_IFRAME`
uyarısı verir — detay: [#15](https://github.com/tariktunc/accessibility-widget/issues/15).

## Webflow

Aynı Custom Element snippet'i kullanın. Webflow Designer'daki **"Embed"** elementi
varsayılan olarak same-origin çalışır — Wix'in sandboxed iframe tuzağının aksine,
Webflow'da bu ekstra dikkat gerektirmez.

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@blakfy/accessibility-widget@2.0.0-alpha.0/dist/widget-element.js"></script>

<blakfy-a11y locale="tr" theme="auto" position="bottom-left"></blakfy-a11y>
```

## Shopify

Shopify'ın embed yüzeyi (`theme.liquid`, `<head>` / `</body>` öncesi, same-origin,
iframe yok) Wix'in sandboxed widget embed'inden ([#15](https://github.com/tariktunc/accessibility-widget/issues/15))
belirgin şekilde daha güvenlidir.

### theme.liquid yerleşimi

Admin → Online Store → Themes → Edit Code → `layout/theme.liquid`. `<script type="module">`
etiketini `<head>...</head>` içine, `<blakfy-a11y ...>` elementini ise `{{ content_for_layout }}`
kapanmadan hemen önce / `</body>` etiketinden hemen önce yapıştırın:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@blakfy/accessibility-widget@2.0.0-alpha.0/dist/widget-element.js"></script>
<blakfy-a11y locale="tr" theme="auto" position="bottom-left"></blakfy-a11y>
```

### CSP notu

Shopify Plus ve bazı özel storefront'lar `shopify.theme.toml`/uygulama konfigürasyonu
üzerinden bir `Content-Security-Policy` header'ı ayarlayabilir. Gerekli izin:

```
script-src 'self' https://cdn.jsdelivr.net;
```

`cdn.jsdelivr.net` bu listede olmazsa module script sessizce yüklenemez — sadece
tarayıcı konsolunda bir CSP violation görünür, widget'ın kendisi hiçbir hata
yüzeye çıkarmaz. Bu, [#15](https://github.com/tariktunc/accessibility-widget/issues/15)/[#20](https://github.com/tariktunc/accessibility-widget/issues/20)
ile aynı "sessiz başarısızlık" risk sınıfı — farklı sebep (CSP engeli, iframe sandbox değil).

### Sık yapılan hata

Snippet'i `theme.liquid` yerine Shopify'ın app-embed-block editörüne (bazı
page-builder uygulamalarının section/block sistemi) yapıştırmak, widget'ı satıcının
page-builder iframe bağlamına hapsedebilir — [#15](https://github.com/tariktunc/accessibility-widget/issues/15)'teki
iframe tuzağıyla aynı arıza ailesi, farklı tetikleyici.

## Sorun mu yaşıyorsunuz?

- Wix sandboxed iframe sorunu: [#15](https://github.com/tariktunc/accessibility-widget/issues/15)
- Sandboxed iframe için e2e regresyon testi: [#19](https://github.com/tariktunc/accessibility-widget/issues/19)
