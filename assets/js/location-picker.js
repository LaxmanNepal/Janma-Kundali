const $ = id => document.getElementById(id);

const RECENT_KEY = 'jk-recent-places';
const MAX_RECENT = 5;

function escapeHtml(value) {
  return String(value).replace(/[&<>\"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[char]));
}

function distanceKm(aLat, aLon, bLat, bLon) {
  const rad = Math.PI / 180;
  const dLat = (bLat - aLat) * rad;
  const dLon = (bLon - aLon) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function recentPlaces() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}

function rememberPlace(name) {
  const next = [name, ...recentPlaces().filter(item => item !== name)].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  localStorage.setItem('jk-last-place', name);
}

function groupFor(name) {
  if (name.endsWith(', Kuwait')) return 'कुवेत';
  const first = name.split(',')[0];
  const east = ['Biratnagar','Dharan','Birtamod','Damak','Ilam','Phidim','Itahari','Rajbiraj','Lahan'];
  const west = ['Pokhara','Butwal','Nepalgunj','Dhangadhi','Birendranagar','Lumbini','Palpa','Tansen','Baglung','Besisahar','Jomsom','Syangja'];
  const central = ['Kathmandu','Hetauda','Bharatpur','Birgunj','Lalitpur','Bhaktapur','Kirtipur','Dhulikhel','Banepa','Nagarkot','Gorkha','Bandipur','Lamang','Damauli','Janakpur','Tulsipur','Ghorahi'];
  if (east.includes(first)) return 'कोशी / मधेश';
  if (west.includes(first)) return 'लुम्बिनी / कर्णाली / सुदूरपश्चिम';
  if (central.includes(first)) return 'बागमती / गण्डकी';
  return 'नेपाल';
}

export async function initLocationPicker() {
  const input = $('place');
  if (!input || input.dataset.locationPicker === 'ready') return;
  input.dataset.locationPicker = 'ready';

  let locations;
  try {
    const response = await fetch(new URL('../../data/locations.json', import.meta.url), {cache:'no-store'});
    if (!response.ok) throw new Error(`locations ${response.status}`);
    locations = await response.json();
  } catch (error) {
    console.warn('[Janma Kundali] location picker', error);
    return;
  }

  const names = Object.keys(locations);
  const datalist = $('places');
  datalist?.replaceChildren(...names.map(name => {
    const option = document.createElement('option');
    option.value = name;
    return option;
  }));

  const shell = document.createElement('div');
  shell.className = 'location-picker';
  input.parentElement?.appendChild(shell);

  const controls = document.createElement('div');
  controls.className = 'location-actions';
  controls.innerHTML = '<button type="button" class="location-action" data-location-action="near">⌖ मेरो नजिकको स्थान</button><span class="location-hint">सटीक GPS नदेखाई सूचीको नजिकको स्थान मात्र छानिन्छ।</span>';
  input.parentElement?.appendChild(controls);

  const panel = document.createElement('div');
  panel.className = 'location-panel';
  panel.hidden = true;
  shell.appendChild(panel);

  let active = -1;
  let filtered = [];

  function selectPlace(name, notify = true) {
    input.value = name;
    rememberPlace(name);
    panel.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.dispatchEvent(new Event('change', {bubbles:true}));
    const location = locations[name];
    let meta = '';
    if (location) meta = `${location.lat.toFixed(4)}°, ${location.lon.toFixed(4)}° · ${location.tz}`;
    const hint = controls.querySelector('.location-hint');
    if (hint) hint.textContent = meta || 'स्थान चयन भयो';
    if (notify && window.__jkToast) window.__jkToast(`जन्म स्थान: ${name}`, 'success');
  }

  function render(query = '') {
    const q = query.trim().toLowerCase();
    filtered = names.filter(name => !q || name.toLowerCase().includes(q));
    active = -1;
    const recent = recentPlaces().filter(name => names.includes(name) && (!q || name.toLowerCase().includes(q)));
    const groups = new Map();
    filtered.forEach(name => {
      const group = groupFor(name);
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(name);
    });

    const parts = [];
    if (!q && recent.length) {
      parts.push('<div class="location-group"><div class="location-group-title">हालै प्रयोग भएका</div>' + recent.map(name => `<button type="button" class="location-option recent" data-place="${escapeHtml(name)}">↺ ${escapeHtml(name)}</button>`).join('') + '</div>');
    }
    for (const [group, items] of groups) {
      parts.push(`<div class="location-group"><div class="location-group-title">${escapeHtml(group)}</div>${items.map(name => `<button type="button" class="location-option" data-place="${escapeHtml(name)}"><span>${escapeHtml(name)}</span><small>${locations[name].tz.replace('Asia/','')}</small></button>`).join('')}</div>`);
    }
    if (!parts.length) parts.push('<div class="location-empty">स्थान भेटिएन। अर्को नाम खोज्नुहोस्।</div>');
    panel.innerHTML = parts.join('');
  }

  function open() {
    render(input.value);
    panel.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.removeAttribute('list');
  input.addEventListener('focus', open);
  input.addEventListener('input', () => open());
  input.addEventListener('keydown', event => {
    if (panel.hidden) return;
    const options = [...panel.querySelectorAll('.location-option')];
    if (event.key === 'ArrowDown') { event.preventDefault(); active = Math.min(active + 1, options.length - 1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); active = Math.max(active - 1, 0); }
    else if (event.key === 'Enter' && active >= 0) { event.preventDefault(); selectPlace(options[active].dataset.place); return; }
    else if (event.key === 'Escape') { panel.hidden = true; input.setAttribute('aria-expanded','false'); return; }
    options.forEach((option, index) => option.classList.toggle('active', index === active));
    options[active]?.scrollIntoView({block:'nearest'});
  });

  panel.addEventListener('mousedown', event => {
    const button = event.target.closest('[data-place]');
    if (!button) return;
    event.preventDefault();
    selectPlace(button.dataset.place);
  });

  controls.querySelector('[data-location-action="near"]')?.addEventListener('click', () => {
    if (!navigator.geolocation) {
      if (window.__jkToast) window.__jkToast('यो ब्राउजरले location समर्थन गर्दैन।', 'warning');
      return;
    }
    const button = controls.querySelector('[data-location-action="near"]');
    button.disabled = true;
    button.textContent = '⌖ स्थान खोजिँदै…';
    navigator.geolocation.getCurrentPosition(position => {
      const {latitude, longitude} = position.coords;
      let nearest = null;
      for (const name of names) {
        const loc = locations[name];
        const distance = distanceKm(latitude, longitude, loc.lat, loc.lon);
        if (!nearest || distance < nearest.distance) nearest = {name, distance};
      }
      if (nearest) {
        selectPlace(nearest.name, false);
        const hint = controls.querySelector('.location-hint');
        if (hint) hint.textContent = `नजिकको उपलब्ध स्थान: ${nearest.name} · करिब ${nearest.distance.toFixed(1)} km`;
        if (window.__jkToast) window.__jkToast(`नजिकको स्थान चयन भयो: ${nearest.name}`, 'success');
      }
      button.disabled = false;
      button.textContent = '⌖ मेरो नजिकको स्थान';
    }, () => {
      if (window.__jkToast) window.__jkToast('Location अनुमति प्राप्त भएन। स्थान सूचीबाट चयन गर्नुहोस्।', 'warning');
      button.disabled = false;
      button.textContent = '⌖ मेरो नजिकको स्थान';
    }, {enableHighAccuracy:false, timeout:8000, maximumAge:300000});
  });

  document.addEventListener('click', event => {
    if (!shell.contains(event.target) && event.target !== input) {
      panel.hidden = true;
      input.setAttribute('aria-expanded', 'false');
    }
  });

  const last = localStorage.getItem('jk-last-place');
  if (!input.value && last && names.includes(last)) selectPlace(last, false);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => void initLocationPicker(), {once:true});
else void initLocationPicker();
