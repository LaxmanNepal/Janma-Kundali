// मुख्य एप runtime
import './app-v2.js';
import './runtime-enhancements.js';
import './location-picker.js';

// Advanced birthplace picker styles are kept separate from the main stylesheet.
const locationStyle = document.createElement('link');
locationStyle.rel = 'stylesheet';
locationStyle.href = new URL('../css/location-picker.css', import.meta.url);
document.head.appendChild(locationStyle);

// GitHub Pages/PWA: version the service-worker URL so a broken/stale browser cache
// cannot keep an older JavaScript bundle after a deployment.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js?v=10', { scope: './' }).catch(err => {
      console.warn('[Janma Kundali] service worker registration skipped:', err);
    });
  }, { once: true });
}
