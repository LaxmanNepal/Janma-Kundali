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
