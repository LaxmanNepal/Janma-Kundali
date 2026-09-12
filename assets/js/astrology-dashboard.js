const $=id=>document.getElementById(id);
let last=null;
function date(d){try{return new Intl.DateTimeFormat('ne-NP',{year:'numeric',month:'short',day:'numeric'}).format(new Date(`${d}T12:00:00`))}catch{return d}}
function currentDasha(periods){const now=new Date();return periods?.find(p=>{const s=new Date(`${p.start}T00:00:00`),e=new Date(`${p.end}T00:00:00`);return now>=s&&now<e})||periods?.[0]}
function render(data){
 if(!data||data===last)return; last=data;
 const host=$('astrologyDashboard'); if(!host)return;
 const planets=data.planets||[], d=data.dasha||{}, periods=d.periods||[], active=currentDasha(periods);
 const retro=planets.filter(p=>p.retrograde).map(p=>p.name).join(' · ')||'कुनै ग्रह वक्री छैन';
 const cards=[
  ['लग्न',data.ascendant?.signName||'—','उदय राशि'],
  ['चन्द्र राशि',data.rashi?.signName||'—','मन / भावना'],
  ['नक्षत्र',data.moonNakshatra?.name||'—',`पाद ${data.moonNakshatra?.pada||'—'}`],
  ['जन्म दशा',d.birthLord||'—','विम्शोत्तरी']
 ];
 host.innerHTML=`<div class="panel astrology-dashboard-panel"><div class="panel-title"><div><h3>🪐 Astrology Dashboard</h3><span>तपाईंको कुण्डलीको द्रुत सारांश</span></div><span class="dashboard-engine">${data.sidereal||'Lahiri'} · ${data.houseSystem||'Whole Sign'}</span></div><div class="astro-metric-grid">${cards.map(c=>`<div class="astro-metric"><small>${c[0]}</small><strong>${c[1]}</strong><span>${c[2]}</span></div>`).join('')}</div><div class="astro-dasha"><div><small>हालको प्रमुख दशा</small><strong>${active?.lord||'—'}</strong><span>${active?`${date(active.start)} → ${date(active.end)}`:'—'}</span></div><div class="dasha-track">${periods.map(p=>`<i class="${p.lord===active?.lord?'current':''}" title="${p.lord}: ${p.start} → ${p.end}"></i>`).join('')}</div></div><div class="astro-bottom"><div><small>वक्री ग्रह</small><b>${retro}</b></div><div><small>गणना समय</small><b>${data.meta?.calculatedAt?date(data.meta.calculatedAt.slice(0,10)):'—'}</b></div></div></div>`;
}
function init(){const host=$('result');if(!host)return;const anchor=$('extendedReport');if(!anchor)return;const section=document.createElement('div');section.id='astrologyDashboard';section.className='astrology-dashboard';anchor.before(section);const tick=()=>render(window.__kundali);setInterval(tick,700);tick()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
