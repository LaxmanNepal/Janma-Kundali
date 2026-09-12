const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
const icon={सूर्य:'☀️',चन्द्र:'🌙',मंगल:'♂️',बुध:'☿',गुरु:'♃',शुक्र:'♀️',शनि:'♄',राहु:'☊',केतु:'☋'};
function open(e){
  let m=document.getElementById('tipEventModal');
  if(!m){m=document.createElement('div');m.id='tipEventModal';m.className='ti-modal';document.body.appendChild(m)}
  m.innerHTML=`<div class="ti-modal-backdrop"></div><div class="ti-modal-card" role="dialog" aria-modal="true"><button class="ti-modal-close" aria-label="Close">×</button><div class="ti-modal-icon">${icon[e.planet]||'✦'}</div><small>${esc(e.priority==='high'?'महत्त्वपूर्ण':'Transit Event')} · ${esc(e.label)}</small><h3>${esc(e.planet)} · ${esc(e.signName)}</h3><b>${new Intl.DateTimeFormat('ne-NP',{dateStyle:'full',timeStyle:'short'}).format(new Date(e.at))}</b><div class="ti-modal-grid"><span>राशि परिवर्तन<strong>${esc(e.fromSign||'')} → ${esc(e.toSign||'')}</strong></span><span>भाव<strong>${e.house}H · ${esc(e.theme||'जीवन क्षेत्र')}</strong></span><span>गति<strong>${e.type==='retrograde'?'वक्री सुरु':e.type==='direct'?'मार्गी सुरु':'राशि प्रवेश'}</strong></span></div><p>यो event Swiss Ephemeris मा ग्रहको स्थिति परिवर्तनबाट पहिचान गरिएको हो। यसको ज्योतिषीय अर्थ परम्परागत interpretation हो, निश्चित भविष्यवाणी वा वैज्ञानिक मापन होइन।</p></div>`;
  const close=()=>m.remove();m.querySelector('.ti-modal-close').onclick=close;m.querySelector('.ti-modal-backdrop').onclick=close;
}
window.__openTransitEvent=open;
function init(){
  document.addEventListener('click',ev=>{const b=ev.target.closest('.tip-event');if(!b)return;const id=b.dataset.event;const list=window.__janmaTransitEvents||[];const e=list.find(x=>x.id===id);if(e){ev.preventDefault();ev.stopImmediatePropagation();open(e)}},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
