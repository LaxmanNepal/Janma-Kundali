const KEY = 'jk-birth-profiles-v3';
const ACTIVE_KEY = 'jk-active-profile-v3';
let lastSeen = null;

function sync() {
  const data = window.__kundali;
  const id = localStorage.getItem(ACTIVE_KEY);
  if (!data || !id || data === lastSeen) return;
  lastSeen = data;
  try {
    const profiles = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(profiles)) return;
    const index = profiles.findIndex(p => p.id === id);
    if (index < 0) return;
    profiles[index] = {
      ...profiles[index],
      lastResult: {
        rashi: data.rashi?.signName || '',
        nakshatra: data.moonNakshatra?.name || '',
        lagna: data.ascendant?.signName || '',
        generatedAt: new Date().toISOString()
      }
    };
    localStorage.setItem(KEY, JSON.stringify(profiles.slice(0, 12)));
    window.dispatchEvent(new CustomEvent('jk:profile-result-updated'));
  } catch (error) {
    console.warn('[Janma Kundali] profile result sync', error);
  }
}

setInterval(sync, 800);
window.addEventListener('jk:kundali-generated', sync);
