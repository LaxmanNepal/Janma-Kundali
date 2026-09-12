const $ = id => document.getElementById(id);

function applyTheme() {
  const saved = localStorage.getItem('jk-theme') || 'light';
  const dark = saved === 'dark';
  document.body?.classList.toggle('dark', dark);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const btn = $('themeBtn');
  if (btn) {
    btn.textContent = dark ? '☀' : '☾';
    btn.setAttribute('aria-pressed', String(dark));
  }
}

function toast(message, kind='info') {
  let box = $('jkToast');
  if (!box) {
    box = document.createElement('div');
    box.id = 'jkToast';
    box.setAttribute('role','status');
    box.setAttribute('aria-live','polite');
    document.body.appendChild(box);
  }
  box.textContent = message;
  box.dataset.kind = kind;
  box.classList.add('show');
  clearTimeout(window.__jkToastTimer);
  window.__jkToastTimer = setTimeout(() => box.classList.remove('show'), 4500);
}

async function enhancePlacePicker() {
  const input = $('place');
  const list = $('places');
  if (!input || !list) return;

  try {
    const response = await fetch(new URL('../../data/locations.json', import.meta.url), {cache:'no-store'});
    if (!response.ok) throw new Error(`स्थान सूची ${response.status}`);
    const locations = await response.json();
    const names = Object.keys(locations).filter((name, index, arr) => arr.indexOf(name) === index);
    list.replaceChildren(...names.map(name => {
      const option = document.createElement('option');
      option.value = name;
      return option;
    }));

    input.setAttribute('aria-autocomplete', 'list');
    input.addEventListener('change', () => {
      const value = input.value.trim();
      if (!value) return;
      const exact = names.find(name => name.toLowerCase() === value.toLowerCase());
      if (exact) {
        input.value = exact;
        localStorage.setItem('jk-last-place', exact);
        toast(`जन्म स्थान: ${exact}`, 'success');
      }
    });

    const last = localStorage.getItem('jk-last-place');
    if (!input.value && last && names.includes(last)) input.value = last;
  } catch (error) {
    console.warn('[Janma Kundali] place picker', error);
  }
}

function wire() {
  applyTheme();

  $('themeBtn')?.addEventListener('click', () => {
    const dark = !document.body.classList.contains('dark');
    localStorage.setItem('jk-theme', dark ? 'dark' : 'light');
    applyTheme();
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    const id = link.getAttribute('href')?.slice(1);
    const target = id && document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({behavior:'smooth', block:'start'});
    history.replaceState(null,'',`#${id}`);
  }));

  const originalAlert = window.alert;
  window.alert = message => toast(String(message), 'warning');
  window.__restoreAlert = () => { window.alert = originalAlert; };

  void enhancePlacePicker();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(reg => {
      reg.update().catch(() => {});
    }).catch(() => {});
  }

  window.addEventListener('unhandledrejection', event => {
    console.warn('[Janma Kundali] background error', event.reason);
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire, {once:true});
else wire();
