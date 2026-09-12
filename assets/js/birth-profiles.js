const KEY = 'jk-birth-profiles-v3';
const ACTIVE_KEY = 'jk-active-profile-v3';
const MAX = 12;

const $ = id => document.getElementById(id);

function readProfiles() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}

function writeProfiles(profiles) {
  localStorage.setItem(KEY, JSON.stringify(profiles.slice(0, MAX)));
}

function activeId() { return localStorage.getItem(ACTIVE_KEY) || ''; }
function setActive(id) { localStorage.setItem(ACTIVE_KEY, id); }

function uid() {
  return `profile-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
}

function toast(message, kind='info') {
  if (window.__jkToast) return window.__jkToast(message, kind);
  let box = $('jkToast');
  if (!box) {
    box = document.createElement('div'); box.id = 'jkToast';
    box.setAttribute('role','status'); document.body.appendChild(box);
  }
  box.textContent = message; box.dataset.kind = kind; box.classList.add('show');
  clearTimeout(window.__jkProfileToast); window.__jkProfileToast = setTimeout(() => box.classList.remove('show'), 3500);
}

function currentForm() {
  const mode = $('bsDateFields')?.classList.contains('hidden') ? 'AD' : 'BS';
  return {
    name: $('name')?.value.trim() || '', mode,
    year: mode === 'AD' ? $('year')?.value : $('bsYear')?.value,
    month: mode === 'AD' ? $('month')?.value : $('bsMonth')?.value,
    day: mode === 'AD' ? $('day')?.value : $('bsDay')?.value,
    time: $('time')?.value || '12:00', place: $('place')?.value.trim() || ''
  };
}

function profileLabel(profile) {
  return profile.name || profile.place?.split(',')[0] || 'जन्म प्रोफाइल';
}

function fillForm(profile) {
  if (!profile) return;
  if ($('name')) $('name').value = profile.name || '';
  if ($('time')) $('time').value = profile.time || '12:00';
  if ($('place')) $('place').value = profile.place || '';
  const modeButton = profile.mode === 'BS' ? $('bsMode') : $('adMode');
  modeButton?.click();
  const prefix = profile.mode === 'BS' ? 'bs' : '';
  const set = (id, value) => { const el = $(id); if (el && value != null) { el.value = String(value); el.dispatchEvent(new Event('change', {bubbles:true})); } };
  set(prefix ? 'bsYear' : 'year', profile.year);
  set(prefix ? 'bsMonth' : 'month', profile.month);
  set(prefix ? 'bsDay' : 'day', profile.day);
}

function profileFromForm(existingId='') {
  const data = currentForm();
  if (!data.name && !data.place) throw new Error('नाम वा जन्म स्थान भर्नुहोस्।');
  if (!data.year || !data.month || !data.day || !data.place) throw new Error('जन्म मिति र स्थान पूरा गर्नुहोस्।');
  return { id: existingId || uid(), ...data, updatedAt: new Date().toISOString() };
}

function openPanel() {
  $('profilePanel')?.classList.add('open');
  $('profilePanel')?.setAttribute('aria-hidden','false');
  render();
}
function closePanel() {
  $('profilePanel')?.classList.remove('open');
  $('profilePanel')?.setAttribute('aria-hidden','true');
}

function render() {
  const list = $('profileList'); if (!list) return;
  const profiles = readProfiles(); const active = activeId();
  if (!profiles.length) {
    list.innerHTML = '<div class="profile-empty">아직 저장된 출생 प्रोफाइल छैन। अहिलेको विवरण भरेर <b>प्रोफाइल सुरक्षित गर्नुहोस्</b> थिच्नुहोस्।</div>';
    return;
  }
  list.innerHTML = profiles.map(p => `<article class="profile-card ${p.id === active ? 'active' : ''}" data-id="${p.id}">
    <div class="profile-avatar">${(profileLabel(p)[0] || 'ज').toUpperCase()}</div>
    <div class="profile-info"><strong>${escapeHtml(profileLabel(p))}</strong><span>${escapeHtml(p.place || 'स्थान छैन')}</span><small>${p.mode} · ${escapeHtml(String(p.year))}-${escapeHtml(String(p.month))}-${escapeHtml(String(p.day))} · ${escapeHtml(p.time || '')}</small></div>
    <div class="profile-card-actions"><button type="button" data-profile-action="load">खोल्नुहोस्</button><button type="button" data-profile-action="edit">सम्पादन</button><button type="button" class="danger" data-profile-action="delete">हटाउनुहोस्</button></div>
  </article>`).join('');
}

function escapeHtml(value) { return String(value).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c])); }

function saveProfile() {
  try {
    const existing = activeId();
    const profiles = readProfiles();
    const data = profileFromForm(existing && profiles.some(p => p.id === existing) ? existing : '');
    const index = profiles.findIndex(p => p.id === data.id);
    if (index >= 0) profiles[index] = data; else profiles.unshift(data);
    writeProfiles(profiles); setActive(data.id); render();
    toast(index >= 0 ? 'प्रोफाइल अपडेट भयो।' : 'जन्म प्रोफाइल सुरक्षित भयो।', 'success');
    refreshBadge();
  } catch (error) { toast(error.message, 'warning'); }
}

function loadProfile(id) {
  const profile = readProfiles().find(p => p.id === id); if (!profile) return;
  setActive(id); fillForm(profile); closePanel(); refreshBadge(); toast(`${profileLabel(profile)} को विवरण लोड भयो।`, 'success');
  $('kundali')?.scrollIntoView({behavior:'smooth', block:'start'});
}

function editProfile(id) {
  const profile = readProfiles().find(p => p.id === id); if (!profile) return;
  setActive(id); fillForm(profile); closePanel(); refreshBadge(); toast('प्रोफाइल सम्पादन मोडमा छ।', 'info');
  $('kundali')?.scrollIntoView({behavior:'smooth', block:'start'});
}

function deleteProfile(id) {
  const profiles = readProfiles(); const profile = profiles.find(p => p.id === id); if (!profile) return;
  if (!window.confirm(`“${profileLabel(profile)}” प्रोफाइल हटाउने?`)) return;
  const next = profiles.filter(p => p.id !== id); writeProfiles(next);
  if (activeId() === id) localStorage.removeItem(ACTIVE_KEY);
  render(); refreshBadge(); toast('प्रोफाइल हटाइयो।', 'success');
}

function refreshBadge() {
  const count = readProfiles().length;
  const badge = $('profileCount'); if (badge) badge.textContent = count ? String(count) : '';
  const active = readProfiles().find(p => p.id === activeId());
  const label = $('activeProfileName'); if (label) label.textContent = active ? `सक्रिय: ${profileLabel(active)}` : 'कुनै सक्रिय प्रोफाइल छैन';
}

export function initBirthProfiles() {
  if ($('birthProfiles')?.dataset.ready === 'true') return;
  const anchor = $('kundaliForm'); if (!anchor) return;
  anchor.dataset.ready = 'true';

  const card = document.createElement('div'); card.className = 'profile-tools'; card.id = 'birthProfiles';
  card.innerHTML = `<div class="profile-tools-head"><div><span class="profile-kicker">V3 · जन्म प्रोफाइल</span><strong id="activeProfileName">कुनै सक्रिय प्रोफाइल छैन</strong></div><div class="profile-tool-buttons"><button type="button" class="secondary-btn profile-save">＋ प्रोफाइल सुरक्षित गर्नुहोस्</button><button type="button" class="secondary-btn profile-manage">प्रोफाइलहरू <span id="profileCount"></span></button></div></div>`;
  anchor.appendChild(card);

  const panel = document.createElement('div'); panel.id = 'profilePanel'; panel.className = 'profile-panel'; panel.setAttribute('aria-hidden','true');
  panel.innerHTML = `<div class="profile-panel-backdrop" data-close-profile></div><div class="profile-sheet"><div class="profile-sheet-head"><div><span class="profile-kicker">V3 Birth Profile System</span><h3>जन्म प्रोफाइलहरू</h3><p>यी विवरणहरू तपाईंको ब्राउजरमै स्थानीय रूपमा सुरक्षित हुन्छन्।</p></div><button type="button" class="icon-btn" data-close-profile aria-label="बन्द">×</button></div><div id="profileList" class="profile-list"></div><div class="profile-privacy">🔒 प्रोफाइल डेटा कुनै server मा पठाइँदैन। Browser को localStorage मै राखिन्छ।</div></div>`;
  document.body.appendChild(panel);

  card.querySelector('.profile-save')?.addEventListener('click', saveProfile);
  card.querySelector('.profile-manage')?.addEventListener('click', openPanel);
  panel.addEventListener('click', event => {
    if (event.target.closest('[data-close-profile]')) return closePanel();
    const cardEl = event.target.closest('.profile-card'); if (!cardEl) return;
    const action = event.target.closest('[data-profile-action]')?.dataset.profileAction;
    if (action === 'load') loadProfile(cardEl.dataset.id);
    if (action === 'edit') editProfile(cardEl.dataset.id);
    if (action === 'delete') deleteProfile(cardEl.dataset.id);
  });

  refreshBadge();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initBirthProfiles, {once:true});
else initBirthProfiles();
