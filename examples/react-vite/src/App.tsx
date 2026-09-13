import { A11yWidget, useA11yPreferences } from '@blakfy/accessibility-widget-react';

function Demo() {
  const prefs = useA11yPreferences();

  return (
    <article
      style={{
        fontSize: prefs.fontScale === 125 ? '1.25rem' : '1rem',
        lineHeight: prefs.lineHeight === 'large' ? 2 : 1.5,
      }}
    >
      <h1>@blakfy/example-react-vite</h1>
      <p>
        Sağ altta erişilebilirlik widget'ının FAB düğmesini açarak tercihleri değiştirin — bu metin
        canlı olarak <code>useA11yPreferences()</code> hook'una göre güncellenir.
      </p>
    </article>
  );
}

export default function App() {
  return (
    <>
      <A11yWidget locale="tr" theme="auto" position="bottom-right" />
      <main>
        <Demo />
      </main>
    </>
  );
}
