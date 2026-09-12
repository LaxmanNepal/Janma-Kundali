// मुख्य एप runtime
import './app-v2.js';
import './runtime-enhancements.js';
import './location-picker.js';
import './birth-profiles.js';
import './profile-result-sync.js';
import './astrology-dashboard.js';
import './dasha-dashboard.js';
import './transit-intelligence.js';
import './transit-calendar.js';
import './transit-pro.js';
import './transit-pro-events.js';
import './transit-forecast.js';
import './personal-intelligence.js';
import './ai-report-engine.js';
import './full-report.js';
import './pdf-studio.js';
import './yoga-dashboard.js';
import './planetary-strength-dashboard.js';
import './life-area-dashboard.js';

const styles=['location-picker','birth-profiles','astrology-dashboard','dasha-dashboard','transit-intelligence','transit-calendar','transit-pro','transit-forecast','personal-intelligence','ai-report','full-report','pdf-studio','yoga-dashboard','planetary-strength','life-area'];
styles.forEach(name=>{const link=document.createElement('link');link.rel='stylesheet';link.href=new URL(`../css/${name}.css`,import.meta.url);document.head.appendChild(link)});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js?v=25', { scope: './' }).catch(err => {
      console.warn('[Janma Kundali] service worker registration skipped:', err);
    });
  }, { once: true });
}
