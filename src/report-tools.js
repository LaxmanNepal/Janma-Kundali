const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

function compactReport(kundali){
  if(!kundali) return null;
  const p = kundali.planets || [];
  return {
    generatedAt: new Date().toISOString(),
    input: kundali.input,
    summary: {
      rashi: kundali.rashi,
      nakshatra: kundali.moonNakshatra,
      lagna: kundali.ascendant
    },
    planets: p.map(x => ({name:x.name, sign:x.sign, signName:x.signName, longitude:x.longitude, retrograde:x.retrograde})),
    dasha: kundali.dasha,
    panchanga: kundali.panchanga,
    gochar: kundali.gochar
  };
}

function downloadJson(data, filename='janma-kundali-report.json'){
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function shareReport(kundali){
  const title = `Janma Kundali — ${kundali?.input?.name || 'जन्म रिपोर्ट'}`;
  const text = `Janma Kundali: ${kundali?.rashi?.signName || ''} · ${kundali?.moonNakshatra?.name || ''} · ${kundali?.ascendant?.signName || ''}`;
  if(navigator.share){
    try { await navigator.share({title, text, url: location.href}); return true; } catch(e){ if(e?.name === 'AbortError') return false; }
  }
  try { await navigator.clipboard.writeText(`${text}\n${location.href}`); alert('रिपोर्ट लिंक clipboard मा copy भयो।'); return true; } catch(e){ return false; }
}

export function initReportTools(){
  const result = document.querySelector('#result');
  const head = result?.querySelector('.section-head');
  if(!result || !head || document.querySelector('#reportTools')) return;
  const bar = document.createElement('div');
  bar.id = 'reportTools'; bar.className = 'report-tools';
  bar.innerHTML = `<button type="button" class="secondary-btn" id="shareReportBtn">↗ Share</button><button type="button" class="secondary-btn" id="jsonReportBtn">{} JSON</button>`;
  head.appendChild(bar);
  document.querySelector('#shareReportBtn').addEventListener('click', () => shareReport(window.__kundali));
  document.querySelector('#jsonReportBtn').addEventListener('click', () => {
    const data = compactReport(window.__kundali);
    if(!data) return;
    const safe = String(window.__kundali?.input?.name || 'report').trim().replace(/[^\p{L}\p{N}_-]+/gu,'-').slice(0,40) || 'report';
    downloadJson(data, `janma-kundali-${safe}.json`);
  });
}
