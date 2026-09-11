const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

function compactReport(kundali){
  if(!kundali) return null;
  return {
    generatedAt:new Date().toISOString(),
    input:kundali.input,
    summary:{rashi:kundali.rashi,nakshatra:kundali.moonNakshatra,lagna:kundali.ascendant},
    planets:(kundali.planets||[]).map(x=>({name:x.name,sign:x.sign,signName:x.signName,longitude:x.longitude,retrograde:x.retrograde})),
    dasha:kundali.dasha,
    panchanga:window.__panchanga||kundali.panchanga||null,
    gochar:window.__gochar||kundali.gochar||null
  };
}

function notify(message,kind='info'){
  let box=document.getElementById('reportToolNotice');
  if(!box){box=document.createElement('div');box.id='reportToolNotice';box.className='accuracy-note';document.getElementById('reportTools')?.appendChild(box)}
  box.textContent=message;box.dataset.kind=kind;box.hidden=false;setTimeout(()=>{box.hidden=true},6000);
}
function downloadJson(data,filename='janma-kundali-report.json'){
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function shareReport(kundali){
  if(!kundali){notify('पहिले कुण्डली निकाल्नुहोस्।','warning');return false}
  const title=`Janma Kundali — ${kundali?.input?.name||'जन्म रिपोर्ट'}`;
  const text=`Janma Kundali: ${kundali?.rashi?.signName||''} · ${kundali?.moonNakshatra?.name||''} · ${kundali?.ascendant?.signName||''}`;
  if(navigator.share){try{await navigator.share({title,text,url:location.href});return true}catch(e){if(e?.name==='AbortError')return false}}
  try{await navigator.clipboard.writeText(`${text}\n${location.href}`);notify('रिपोर्ट लिंक clipboard मा copy भयो।','success');return true}catch(e){notify('Share/clipboard उपलब्ध छैन।','warning');return false}
}
export function initReportTools(){
  const result=document.querySelector('#result'),head=result?.querySelector('.section-head');
  if(!result||!head||document.querySelector('#reportTools'))return;
  const bar=document.createElement('div');bar.id='reportTools';bar.className='report-tools';
  bar.innerHTML='<button type="button" class="secondary-btn" id="shareReportBtn">↗ Share</button><button type="button" class="secondary-btn" id="jsonReportBtn">{} JSON</button><span id="reportToolNotice" class="accuracy-note" hidden></span>';
  head.appendChild(bar);
  document.querySelector('#shareReportBtn')?.addEventListener('click',()=>void shareReport(window.__kundali));
  document.querySelector('#jsonReportBtn')?.addEventListener('click',()=>{const data=compactReport(window.__kundali);if(!data){notify('पहिले कुण्डली निकाल्नुहोस्।','warning');return}const safe=String(window.__kundali?.input?.name||'report').trim().replace(/[^\p{L}\p{N}_-]+/gu,'-').slice(0,40)||'report';downloadJson(data,`janma-kundali-${safe}.json`);notify('JSON रिपोर्ट तयार भयो।','success')});
}
