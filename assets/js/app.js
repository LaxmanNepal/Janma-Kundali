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

const locationStyle = document.createElement('link');
locationStyle.rel = 'stylesheet';
locationStyle.href = new URL('../css/location-picker.css', import.meta.url);
document.head.appendChild(locationStyle);

const profileStyle = document.createElement('link');
profileStyle.rel = 'stylesheet';
profileStyle.href = new URL('../css/birth-profiles.css', import.meta.url);
document.head.appendChild(profileStyle);

const dashboardStyle = document.createElement('link');
dashboardStyle.rel = 'stylesheet';
dashboardStyle.href = new URL('../css/astrology-dashboard.css', import.meta.url);
document.head.appendChild(dashboardStyle);

const dashaStyle = document.createElement('link');
dashaStyle.rel = 'stylesheet';
dashaStyle.href = new URL('../css/dasha-dashboard.css', import.meta.url);
document.head.appendChild(dashaStyle);

const transitStyle = document.createElement('link');
transitStyle.rel = 'stylesheet';
transitStyle.href = new URL('../css/transit-intelligence.css', import.meta.url);
document.head.appendChild(transitStyle);

const transitCalendarStyle = document.createElement('link');
transitCalendarStyle.rel = 'stylesheet';
transitCalendarStyle.href = new URL('../css/transit-calendar.css', import.meta.url);
document.head.appendChild(transitCalendarStyle);

const transitProStyle = document.createElement('link');
transitProStyle.rel = 'stylesheet';
transitProStyle.href = new URL('../css/transit-pro.css', import.meta.url);
document.head.appendChild(transitProStyle);

const transitForecastStyle = document.createElement('link');
transitForecastStyle.rel = 'stylesheet';
transitForecastStyle.href = new URL('../css/transit-forecast.css', import.meta.url);
document.head.appendChild(transitForecastStyle);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js?v=18', { scope: './' }).catch(err => {
      console.warn('[Janma Kundali] service worker registration skipped:', err);
    });
  }, { once: true });
}