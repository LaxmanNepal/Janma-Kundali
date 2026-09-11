// मुख्य एप runtime
import './app-v2.js';
import './runtime-enhancements.js';

// GitHub Pages/PWA: version the service-worker URL so a broken/stale browser cache
// cannot keep an older JavaScript bundle after a deployment.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js?v=9', { scope: './' }).catch(err => {
      console.warn('[Janma Kundali] service worker registration skipped:', err);
    });
  }, { once: true });
}
