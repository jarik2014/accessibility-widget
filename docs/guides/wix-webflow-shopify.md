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

Shopify için Liquid'e özel ayrı bir rehber var — bkz. [Shopify guide](./shopify.md)
(takip: [#18](https://github.com/tariktunc/accessibility-widget/issues/18)).

## Sorun mu yaşıyorsunuz?

- Wix sandboxed iframe sorunu: [#15](https://github.com/tariktunc/accessibility-widget/issues/15)
- Sandboxed iframe için e2e regresyon testi: [#19](https://github.com/tariktunc/accessibility-widget/issues/19)
