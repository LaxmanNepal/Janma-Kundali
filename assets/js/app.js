// मुख्य एप runtime
import './app-v2.js';
import './runtime-enhancements.js';

// GitHub Pages/PWA: register from the deployed root so offline cache works reliably.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(err => {
      console.warn('[Janma Kundali] Service worker registration skipped:', err);
    });
  }, { once: true });
}
