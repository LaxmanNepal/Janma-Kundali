const ORDER=['केतु','शुक्र','सूर्य','चन्द्र','मंगल','राहु','गुरु','शनि','बुध'];
const YEARS={केतु:7,शुक्र:20,सूर्य:6,चन्द्र:10,मंगल:7,राहु:18,गुरु:16,शनि:19,बुध:17};
const $=id=>document.getElementById(id);
const DAY=86400000;
let lastData=null,lastSignature='';

function addYears(date,years){return new Date(date.getTime()+years*365.2425*DAY)}
function iso(d){return d.toISOString().slice(0,10)}
function dateText(value){try{return new Intl.DateTimeFormat('ne-NP',{year:'numeric',month:'short',day:'numeric'}).format(new Date(`${value}T12:00:00`))}catch{return value||'—'}}
function nowInZone(zone){
  try{
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
    const get=t=>parts.find(p=>p.type===t)?.value;
    return new Date(`${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`);
  }catch{return new Date()}
}
function findActive(periods,now){return periods?.find(p=>now>=new Date(`${p.start}T00:00:00`)&&now<new Date(`${p.end}T23:59:59`))||null}
function subPeriods(parent){
  const start=new Date(`${parent.start}T00:00:00`),end=new Date(`${parent.end}T00:00:00`),total=end-start;
  const index=ORDER.indexOf(parent.lord); let cursor=start;
  return ORDER.map((_,i)=>{
    const lord=ORDER[(index+i)%9],duration=total*(YEARS[lord]/120),next=i===8?end:new Date(cursor.getTime()+duration),item={lord,start:iso(cursor),end:iso(next),startDate:cursor,endDate:next};cursor=next;return item;
  });
}
function subSubPeriods(parent){
  const start=parent.startDate||new Date(`${parent.start}T00:00:00`),end=parent.endDate||new Date(`${parent.end}T00:00:00`),total=end-start,index=ORDER.indexOf(parent.lord);let cursor=start;
  return ORDER.map((_,i)=>{const lord=ORDER[(index+i)%9],duration=total*(YEARS[lord]/120),next=i===8?end:new Date(cursor.getTime()+duration);const item={lord,start:iso(cursor),end:iso(next),startDate:cursor,endDate:next};cursor=next;return item});
}
function activeHierarchy(periods,now){
  const maha=findActive(periods,now);if(!maha)return null;
  const antarList=subPeriods(maha),antar=antarList.find(p=>now>=p.startDate&&now<=(p.endDate||now))||antarList[0];
  const pratyantarList=subSubPeriods(antar),pratyantar=pratyantarList.find(p=>now>=p.startDate&&now<=(p.endDate||now))||pratyantarList[0];
  return{maha,antar,pratyantar,antarList,pratyantarList};
}
function remaining(end,now){return Math.max(0,Math.ceil((end-now)/DAY))}
function progress(start,end,now){return Math.max(0,Math.min(100,((now-start)/(end-start))*100))}
function planetInfo(data,lord){return(data.planets||[]).find(p=>p.name===lord)||null}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function render(data,selectedIndex=0){
  const host=$('dashaDashboard');if(!host||!data?.dasha?.periods?.length)return;
  const zone=data.input?.timezone||'Asia/Kathmandu',now=nowInZone(zone),periods=data.dasha.periods;
  const hierarchy=activeHierarchy(periods,now),selected=Math.max(0,Math.min(periods.length-1,selectedIndex));
  const selectedMaha=periods[selected],selectedAntars=subPeriods(selectedMaha),selectedPlanet=planetInfo(data,selectedMaha.lord);
  const currentPlanet=planetInfo(data,hierarchy?.maha?.lord);
  const signature=[data,selected,Math.floor(Date.now()/30000)].join('|');if(signature===lastSignature)return;lastSignature=signature;lastData=data;
  const h=hierarchy;
  const current=h?`<div class="dasha-today-card"><div class="dasha-now-head"><span>आजको दशा</span><b>${esc(h.maha.lord)} → ${esc(h.antar.lord)} → ${esc(h.pratyantar.lord)}</b></div><div class="dasha-now-grid"><div><small>महादशा</small><strong>${esc(h.maha.lord)}</strong><span>${dateText(h.maha.start)} → ${dateText(h.maha.end)}</span></div><div><small>अन्तरदशा</small><strong>${esc(h.antar.lord)}</strong><span>${dateText(h.antar.start)} → ${dateText(h.antar.end)}</span></div><div><small>प्रत्यन्तर</small><strong>${esc(h.pratyantar.lord)}</strong><span>${dateText(h.pratyantar.start)} → ${dateText(h.pratyantar.end)}</span></div></div><div class="dasha-progress"><div><span>महादशा प्रगति</span><b>${progress(new Date(`${h.maha.start}T00:00:00`),new Date(`${h.maha.end}T00:00:00`),now).toFixed(1)}%</b></div><i><em style="width:${progress(new Date(`${h.maha.start}T00:00:00`),new Date(`${h.maha.end}T00:00:00`),now)}%"></em></i><small>${remaining(new Date(`${h.maha.end}T00:00:00`),now)} दिन बाँकी · अर्को संक्रमण ${dateText(h.maha.end)}</small></div></div>`:'<div class="dasha-today-card"><b>हालको दशा पत्ता लगाउन सकिएन।</b></div>';
  const timeline=periods.map((p,i)=>`<button class="dasha-period ${i===selected?'selected':''} ${h?.maha===p?'active':''}" data-dasha-index="${i}"><span>${i+1}</span><b>${esc(p.lord)}</b><small>${dateText(p.start)} – ${dateText(p.end)}</small><em>${p.years} वर्ष</em></button>`).join('');
  const planet=currentPlanet||selectedPlanet;
  const planetCard=planet?`<div class="dasha-planet-card"><div class="dasha-planet-icon">${esc(planet.name)}</div><div><small>ग्रह विवरण</small><strong>${esc(planet.name)}</strong><span>${esc(planet.signName||'—')} · ${esc(planet.degree!=null?Number(planet.degree).toFixed(1)+'°':'—')} · ${planet.retrograde?'वक्री':'मार्गी'}</span></div><div><small>नक्षत्र</small><b>${esc(planet.nakshatra||'—')}</b><span>पाद ${esc(planet.pada||'—')}</span></div></div>`:'';
  const antars=selectedAntars.map(p=>`<div class="dasha-subrow ${h?.maha===selectedMaha&&h?.antar?.lord===p.lord&&h.antar.start===p.start?'current':''}"><b>${esc(p.lord)}</b><span>${dateText(p.start)} → ${dateText(p.end)}</span><small>${remaining(p.endDate||new Date(`${p.end}T00:00:00`),now)} दिन</small></div>`).join('');
  host.innerHTML=`<div class="panel dasha-dashboard-panel"><div class="panel-title"><div><h3>⏳ Vimshottari Dasha Timeline</h3><span>महादशा · अन्तरदशा · प्रत्यन्तरदशा</span></div><span class="dashboard-engine">${esc(data.dasha.method||'Vimshottari')}</span></div>${current}${planetCard}<div class="dasha-section-label"><b>महादशा क्रम</b><span>कुनै अवधिमा ट्याप गरेर विवरण हेर्नुहोस्</span></div><div class="dasha-period-grid">${timeline}</div><div class="dasha-selected"><div class="dasha-selected-head"><div><small>चयन गरिएको महादशा</small><strong>${esc(selectedMaha.lord)}</strong><span>${dateText(selectedMaha.start)} → ${dateText(selectedMaha.end)} · ${selectedMaha.years} वर्ष</span></div><b>${remaining(new Date(`${selectedMaha.end}T00:00:00`),now)} दिन बाँकी</b></div><div class="dasha-subtitle">अन्तरदशा</div><div class="dasha-subrows">${antars}</div></div></div>`;
  host.querySelectorAll('[data-dasha-index]').forEach(btn=>btn.addEventListener('click',()=>render(data,Number(btn.dataset.dashaIndex))));
}
function init(){const anchor=$('astrologyDashboard')||$('extendedReport');if(!anchor)return;const section=document.createElement('div');section.id='dashaDashboard';section.className='dasha-dashboard';anchor.after(section);let selected=0;setInterval(()=>{const data=window.__kundali;if(data){if(data!==lastData)selected=data.dasha?.periods?.findIndex(p=>p.lord===data.dasha?.birthLord)||0;render(data,selected)}},5000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();