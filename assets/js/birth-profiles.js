import { bsToAdString } from './bs-date.js';

const KEY = 'jk-birth-profiles-v3';
const ACTIVE_KEY = 'jk-active-profile-v3';
const EDIT_KEY = 'jk-editing-profile-v3';
const FAVORITES_KEY = 'jk-favorite-profiles-v3';
const MAX = 12;
const $ = id => document.getElementById(id);

function readProfiles() { try { const value = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } }
function writeProfiles(profiles) { localStorage.setItem(KEY, JSON.stringify(profiles.slice(0, MAX))); }
function activeId() { return localStorage.getItem(ACTIVE_KEY) || ''; }
function setActive(id) { localStorage.setItem(ACTIVE_KEY, id); }
function favorites() { try { const v = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } }
function setFavorites(v) { localStorage.setItem(FAVORITES_KEY, JSON.stringify([...new Set(v)])); }
function isFavorite(id) { return favorites().includes(id); }
function uid() { return `profile-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`; }
function toast(message, kind = 'info') {
  if (window.__jkToast) return window.__jkToast(message, kind);
  let box = $('jkToast');
  if (!box) { box = document.createElement('div'); box.id = 'jkToast'; box.setAttribute('role', 'status'); document.body.appendChild(box); }
  box.textContent = message; box.dataset.kind = kind; box.classList.add('show');
  clearTimeout(window.__jkProfileToast); window.__jkProfileToast = setTimeout(() => box.classList.remove('show'), 3500);
}
function currentForm() {
  const mode = $('bsDateFields')?.classList.contains('hidden') ? 'AD' : 'BS';
  return { name: $('name')?.value.trim() || '', mode, year: mode === 'AD' ? $('year')?.value : $('bsYear')?.value, month: mode === 'AD' ? $('month')?.value : $('bsMonth')?.value, day: mode === 'AD' ? $('day')?.value : $('bsDay')?.value, time: $('time')?.value || '12:00', place: $('place')?.value.trim() || '' };
}
function profileLabel(p) { return p.name || p.place?.split(',')[0] || 'जन्म प्रोफाइल'; }
function escapeHtml(v) { return String(v).replace(/[&<>\"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;' }[c] || c)); }
function birthAdDate(p) {
  try { return p.mode === 'BS' ? bsToAdString(Number(p.year), Number(p.month), Number(p.day)) : `${p.year}-${String(p.month).padStart(2,'0')}-${String(p.day).padStart(2,'0')}`; } catch { return ''; }
}
function ageText(p) {
  const value = birthAdDate(p); if (!value) return 'उमेर —';
  const dob = new Date(`${value}T12:00:00`); if (Number.isNaN(dob.getTime())) return 'उमेर —';
  const now = new Date(); let age = now.getFullYear() - dob.getFullYear();
  const beforeBirthday = now.getMonth() < dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate());
  if (beforeBirthday) age--; return age >= 0 && age < 150 ? `${age} वर्ष` : 'उमेर —';
}
function dateText(p) { return p.mode === 'BS' ? `${p.year} · ${p.month} · ${p.day} BS` : `${p.year}-${String(p.month).padStart(2,'0')}-${String(p.day).padStart(2,'0')} AD`; }
function fillForm(p) {
  if (!p) return;
  if ($('name')) $('name').value = p.name || ''; if ($('time')) $('time').value = p.time || '12:00'; if ($('place')) $('place').value = p.place || '';
  ($('bsMode') && p.mode === 'BS' ? $('bsMode') : $('adMode'))?.click();
  const prefix = p.mode === 'BS' ? 'bs' : ''; const set = (id, v) => { const el = $(id); if (el && v != null) { el.value = String(v); el.dispatchEvent(new Event('change', { bubbles: true })); } };
  set(prefix ? 'bsYear' : 'year', p.year); set(prefix ? 'bsMonth' : 'month', p.month); set(prefix ? 'bsDay' : 'day', p.day);
}
function profileFromForm(id = '') {
  const data = currentForm();
  if (!data.name && !data.place) throw new Error('नाम वा जन्म स्थान भर्नुहोस्।');
  if (!data.year || !data.month || !data.day || !data.place) throw new Error('जन्म मिति र स्थान पूरा गर्नुहोस्।');
  return { id: id || uid(), ...data, updatedAt: new Date().toISOString() };
}
function openPanel() { $('profilePanel')?.classList.add('open'); $('profilePanel')?.setAttribute('aria-hidden','false'); render(); }
function closePanel() { $('profilePanel')?.classList.remove('open'); $('profilePanel')?.setAttribute('aria-hidden','true'); }
function updateProfileResult(id, meta) {
  const profiles = readProfiles(), index = profiles.findIndex(p => p.id === id); if (index < 0) return;
  profiles[index] = { ...profiles[index], lastResult: { ...meta, generatedAt: new Date().toISOString() } }; writeProfiles(profiles); render(); refreshBadge();
}
function resultSummary(p) { const r = p.lastResult || {}; return [r.rashi && `राशि ${r.rashi}`, r.nakshatra && `नक्षत्र ${r.nakshatra}`, r.lagna && `लग्न ${r.lagna}`].filter(Boolean).join(' · ') || 'अझै कुण्डली निकालिएको छैन'; }
function render() {
  const list = $('profileList'); if (!list) return;
  const all = readProfiles(), active = activeId(), query = ($('profileSearch')?.value || '').trim().toLowerCase();
  const profiles = all.filter(p => !query || `${profileLabel(p)} ${p.place || ''}`.toLowerCase().includes(query));
  if (!all.length) { list.innerHTML = '<div class="profile-empty">अझै कुनै जन्म प्रोफाइल छैन। अहिलेको विवरण भरेर <b>प्रोफाइल सुरक्षित गर्नुहोस्</b> थिच्नुहोस्।</div>'; return; }
  if (!profiles.length) { list.innerHTML = '<div class="profile-empty">खोजीसँग मिल्ने प्रोफाइल भेटिएन।</div>'; return; }
  list.innerHTML = profiles.map(p => {
    const fav = isFavorite(p.id), r = p.lastResult || {};
    return `<article class="profile-card ${p.id === active ? 'active' : ''}" data-id="${escapeHtml(p.id)}">
      <div class="profile-avatar">${escapeHtml((profileLabel(p)[0] || 'ज').toUpperCase())}</div>
      <div class="profile-info"><div class="profile-name-row"><strong>${escapeHtml(profileLabel(p))}</strong>${p.id === active ? '<span class="profile-active-badge">सक्रिय</span>' : ''}${fav ? '<span class="profile-fav">★</span>' : ''}</div>
      <span>${escapeHtml(p.place || 'स्थान छैन')}</span><small>${escapeHtml(dateText(p))} · ${escapeHtml(p.time || '')} · ${escapeHtml(ageText(p))}</small>
      <em>${escapeHtml(resultSummary(p))}</em></div>
      <div class="profile-card-actions">
        <button type="button" data-profile-action="generate">🔮 कुण्डली</button><button type="button" data-profile-action="load">खोल्नुहोस्</button><button type="button" data-profile-action="edit">सम्पादन</button><button type="button" data-profile-action="favorite">${fav ? '★ हटाउनुहोस्' : '☆ मनपर्ने'}</button><button type="button" data-profile-action="duplicate">प्रतिलिपि</button><button type="button" class="danger" data-profile-action="delete">हटाउनुहोस्</button>
      </div></article>`;
  }).join('');
}
function saveProfile() { try { const data = profileFromForm(), profiles = readProfiles(); if (profiles.length >= MAX) throw new Error(`अधिकतम ${MAX} प्रोफाइल मात्र सुरक्षित गर्न सकिन्छ।`); profiles.unshift(data); writeProfiles(profiles); setActive(data.id); localStorage.removeItem(EDIT_KEY); render(); refreshBadge(); toast('नयाँ जन्म प्रोफाइल सुरक्षित भयो।','success'); } catch (e) { toast(e.message,'warning'); } }
function updateProfile(id) { try { const profiles = readProfiles(), index = profiles.findIndex(p => p.id === id); if (index < 0) return; const oldResult = profiles[index].lastResult; const data = profileFromForm(id); if (oldResult) data.lastResult = oldResult; profiles[index] = data; writeProfiles(profiles); setActive(id); localStorage.removeItem(EDIT_KEY); render(); refreshBadge(); toast('प्रोफाइल अपडेट भयो।','success'); } catch (e) { toast(e.message,'warning'); } }
function loadProfile(id, shouldGenerate = false) { const p = readProfiles().find(x => x.id === id); if (!p) return; setActive(id); localStorage.removeItem(EDIT_KEY); fillForm(p); closePanel(); refreshBadge(); toast(`${profileLabel(p)} को विवरण लोड भयो।`,'success'); $('kundaliForm')?.scrollIntoView({behavior:'smooth',block:'start'}); if (shouldGenerate) setTimeout(() => $('kundaliForm')?.requestSubmit(), 120); }
function editProfile(id) { const p = readProfiles().find(x => x.id === id); if (!p) return; setActive(id); localStorage.setItem(EDIT_KEY,id); fillForm(p); closePanel(); refreshBadge(); toast('प्रोफाइल सम्पादन मोडमा छ। सुरक्षित गर्दा यही प्रोफाइल अपडेट हुनेछ।','info'); $('kundaliForm')?.scrollIntoView({behavior:'smooth',block:'start'}); }
function deleteProfile(id) { const profiles = readProfiles(), p = profiles.find(x => x.id === id); if (!p) return; if (!window.confirm(`“${profileLabel(p)}” प्रोफाइल हटाउने?`)) return; writeProfiles(profiles.filter(x => x.id !== id)); setFavorites(favorites().filter(x => x !== id)); if (activeId() === id) localStorage.removeItem(ACTIVE_KEY); if (localStorage.getItem(EDIT_KEY) === id) localStorage.removeItem(EDIT_KEY); render(); refreshBadge(); toast('प्रोफाइल हटाइयो।','success'); }
function duplicateProfile(id) { const source = readProfiles().find(p => p.id === id), profiles = readProfiles(); if (!source) return; if (profiles.length >= MAX) return toast(`अधिकतम ${MAX} प्रोफाइल मात्र सुरक्षित गर्न सकिन्छ।`,'warning'); const copy = {...source,id:uid(),name:`${profileLabel(source)} · प्रतिलिपि`,updatedAt:new Date().toISOString(),lastResult: source.lastResult ? {...source.lastResult} : undefined}; profiles.unshift(copy); writeProfiles(profiles); setActive(copy.id); render(); refreshBadge(); toast('प्रोफाइलको प्रतिलिपि बनाइयो।','success'); }
function toggleFavorite(id) { const f = favorites(); setFavorites(f.includes(id) ? f.filter(x => x !== id) : [...f,id]); render(); toast(f.includes(id) ? 'मनपर्नेबाट हटाइयो।' : 'मनपर्नेमा थपियो।','success'); }
function exportProfiles() { const payload = {version:3, exportedAt:new Date().toISOString(), profiles:readProfiles(), favorites:favorites()}; const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob), a=document.createElement('a'); a.href=url; a.download=`janma-kundali-profiles-${new Date().toISOString().slice(0,10)}.json`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),500); toast('प्रोफाइल backup डाउनलोड भयो।','success'); }
function importProfiles(file) { if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const raw=JSON.parse(reader.result), incoming=Array.isArray(raw)?raw:raw.profiles; if(!Array.isArray(incoming)) throw new Error('मान्य profile backup होइन।'); const clean=incoming.filter(p=>p&&typeof p==='object'&&p.place&&p.year&&p.month&&p.day).map(p=>({...p,id:typeof p.id==='string'?p.id:uid()})); const merged=[...readProfiles()]; clean.forEach(p=>{const i=merged.findIndex(x=>x.id===p.id); if(i>=0)merged[i]={...merged[i],...p}; else if(merged.length<MAX)merged.push(p);}); writeProfiles(merged); if(Array.isArray(raw.favorites))setFavorites(raw.favorites.filter(id=>merged.some(p=>p.id===id))); render(); refreshBadge(); toast(`${Math.min(clean.length,MAX)} प्रोफाइल restore गरियो।`,'success'); } catch(e){toast(`Backup import असफल: ${e.message}`,'warning');} }; reader.readAsText(file); }
function refreshBadge() { const profiles=readProfiles(),badge=$('profileCount'); if(badge)badge.textContent=profiles.length?String(profiles.length):''; const active=profiles.find(p=>p.id===activeId()),label=$('activeProfileName'); if(label)label.textContent=active?`सक्रिय: ${profileLabel(active)}`:'कुनै सक्रिय प्रोफाइल छैन'; const save=$('birthProfiles')?.querySelector('.profile-save'); if(save)save.textContent=localStorage.getItem(EDIT_KEY)?'✓ प्रोफाइल अपडेट गर्नुहोस्':'＋ प्रोफाइल सुरक्षित गर्नुहोस्'; }
function handleGenerated(event) { const active=activeId(); if(!active)return; const d=event.detail||{}; updateProfileResult(active,{rashi:d.rashi||'',nakshatra:d.nakshatra||'',lagna:d.lagna||''}); }
export function initBirthProfiles() {
  if ($('birthProfiles')?.dataset.ready==='true') return; const anchor=$('kundaliForm'); if(!anchor)return;
  const card=document.createElement('div'); card.className='profile-tools'; card.id='birthProfiles'; card.dataset.ready='true'; card.innerHTML='<div class="profile-tools-head"><div><span class="profile-kicker">V3 · जन्म प्रोफाइल Dashboard</span><strong id="activeProfileName">कुनै सक्रिय प्रोफाइल छैन</strong></div><div class="profile-tool-buttons"><button type="button" class="secondary-btn profile-save">＋ प्रोफाइल सुरक्षित गर्नुहोस्</button><button type="button" class="secondary-btn profile-manage">प्रोफाइलहरू <span id="profileCount"></span></button></div></div>';
  anchor.appendChild(card);
  const panel=document.createElement('div'); panel.id='profilePanel'; panel.className='profile-panel'; panel.setAttribute('aria-hidden','true'); panel.innerHTML='<div class="profile-panel-backdrop" data-close-profile></div><div class="profile-sheet"><div class="profile-sheet-head"><div><span class="profile-kicker">V3 Birth Profile System</span><h3>जन्म प्रोफाइल Dashboard</h3><p>प्रोफाइल, मनपर्ने, backup र अन्तिम कुण्डली सारांश एउटै ठाउँमा।</p></div><button type="button" class="icon-btn" data-close-profile aria-label="बन्द">×</button></div><div class="profile-dashboard-tools"><input id="profileSearch" type="search" placeholder="प्रोफाइल खोज्नुहोस्…" aria-label="प्रोफाइल खोज्नुहोस्"><button type="button" class="secondary-btn" data-profile-tool="export">↓ Backup</button><button type="button" class="secondary-btn" data-profile-tool="import">↑ Restore</button><input id="profileImport" type="file" accept="application/json,.json" hidden></div><div id="profileList" class="profile-list"></div><div class="profile-privacy">🔒 सबै प्रोफाइल र backup browser/localStorage मै छन्। कुनै server मा पठाइँदैन।</div></div>'; document.body.appendChild(panel);
  card.querySelector('.profile-save')?.addEventListener('click',()=>{const edit=localStorage.getItem(EDIT_KEY); edit?updateProfile(edit):saveProfile();}); card.querySelector('.profile-manage')?.addEventListener('click',openPanel);
  $('profileSearch')?.addEventListener('input',render); $('profilePanel')?.addEventListener('click',e=>{if(e.target.closest('[data-close-profile]'))return closePanel(); const tool=e.target.closest('[data-profile-tool]')?.dataset.profileTool; if(tool==='export')return exportProfiles(); if(tool==='import')return $('profileImport')?.click(); const c=e.target.closest('.profile-card'); if(!c)return; const a=e.target.closest('[data-profile-action]')?.dataset.profileAction; if(a==='load')loadProfile(c.dataset.id); if(a==='generate')loadProfile(c.dataset.id,true); if(a==='edit')editProfile(c.dataset.id); if(a==='favorite')toggleFavorite(c.dataset.id); if(a==='duplicate')duplicateProfile(c.dataset.id); if(a==='delete')deleteProfile(c.dataset.id);}); $('profileImport')?.addEventListener('change',e=>{importProfiles(e.target.files?.[0]); e.target.value='';});
  window.addEventListener('jk:kundali-generated',handleGenerated); refreshBadge();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initBirthProfiles,{once:true}); else initBirthProfiles();