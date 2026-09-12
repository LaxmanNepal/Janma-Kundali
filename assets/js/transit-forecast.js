import { calculateCurrentTransits } from './astrology.js';

const $=id=>document.getElementById(id);
const FOCUS={career:[6,10,2,11],finance:[2,11,5,9],marriage:[7,2,11]};
const WEIGHT={सूर्य:8,चन्द्र:6,मंगल:8,बुध:6,गुरु:10,शुक्र:7,शनि:10,राहु:9,केतु:9};
const ICON={सूर्य:'☀️',चन्द्र:'🌙',मंगल:'♂️',बुध:'☿',गुरु:'♃',शुक्र:'♀️',शनि:'♄',राहु:'☊',केतु:'☋'};
const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
const level=n=>n>=72?'उच्च':n>=55?'मध्यम':'शान्त';
const dayNames=['आज','भोलि','२ दिनमा','३ दिनमा','४ दिनमा','५ दिनमा','६ दिनमा'];
let busy=false,lastData=null;
function score(planets,houses){let s=50;planets.forEach(p=>{if(houses.includes(p.house)){s+=(WEIGHT[p.name]||6)*(p.retrograde?-0.65:0.8)}});return clamp(s)}
function render(data,rows){
  const host=$('transitIntelligence');if(!host)return;let el=$('tiForecast');if(!el){el=document.createElement('section');el.id='tiForecast';el.className='ti-forecast';host.appendChild(el)}
  const latest=rows[0]?.transit?.planets||[], areas=[['करियर','career'],['वित्त','finance'],['विवाह','marriage']];
  const cards=areas.map(([label,key])=>{const s=score(latest,FOCUS[key]);return `<div class="tf-score"><small>${label}</small><b>${s}</b><i><em style="width:${s}%"></em></i><span>${level(s)} सक्रियता</span></div>`}).join('');
  const days=rows.map((r,i)=>{const p=r.transit?.planets||[];const sat=p.find(x=>x.name==='शनि'),jup=p.find(x=>x.name==='गुरु'),moon=p.find(x=>x.name==='चन्द्र');const active=[...new Set(p.filter(x=>x.natalAspects?.length).map(x=>x.name))];return `<button class="tf-day ${i===0?'active':''}" data-day="${i}"><b>${dayNames[i]}</b><small>${new Intl.DateTimeFormat('ne-NP',{month:'short',day:'numeric'}).format(r.at)}</small><span>${ICON.चन्द्र} ${moon?.signName||'—'} · ${moon?.house||'—'}H</span><span>${ICON.गुरु} ${jup?.house||'—'}H · ${ICON.शनि} ${sat?.house||'—'}H</span><em>${active.length?active.join(' · ')+' aspect':'शान्त transit'}</em></button>`}).join('');
  el.innerHTML=`<div class="panel tf-panel"><div class="panel-title"><div><h3>📈 Predictive Transit Dashboard</h3><span>दैनिक · साप्ताहिक · व्यक्तिगत natal-aspect overview</span></div><span class="ti-live">V4.8</span></div><div class="tf-score-grid">${cards}</div><div class="ti-section-title"><b>☀️ ७-दिने Transit Outlook</b><small>हरेक दिन पुनः Swiss Ephemeris गणना</small></div><div class="tf-days">${days}</div><div class="tf-detail" id="tfDetail"></div><div class="tf-note">यो dashboard परम्परागत ज्योतिषीय interpretation का लागि बनाइएको heuristic overview हो। यसले निश्चित भविष्यवाणी वा वैज्ञानिक risk score दाबी गर्दैन।</div></div>`;
  const show=i=>{const r=rows[i],p=r.transit?.planets||[],aspects=p.filter(x=>x.natalAspects?.length);const area=areas.map(([l,k])=>`${l}: ${score(p,FOCUS[k])}`).join(' · ');el.querySelector('#tfDetail').innerHTML=`<div class="tf-detail-grid"><div><small>मिति</small><b>${new Intl.DateTimeFormat('ne-NP',{dateStyle:'full'}).format(r.at)}</b></div><div><small>मुख्य ग्रह</small><b>${p.filter(x=>['गुरु','शनि','राहु','केतु'].includes(x.name)).map(x=>`${ICON[x.name]} ${x.name} ${x.house}H`).join(' · ')||'—'}</b></div><div><small>Natal aspects</small><b>${aspects.map(x=>`${ICON[x.name]||'✦'} ${x.name}`).join(' · ')||'कुनै प्रमुख aspect छैन'}</b></div><div><small>Life-area scores</small><b>${area}</b></div></div>`};el.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{el.querySelectorAll('.tf-day').forEach(x=>x.classList.remove('active'));b.classList.add('active');show(Number(b.dataset.day))});show(0);
}
async function refresh(){const data=window.__kundali;if(!data||busy||data===lastData)return;busy=true;try{const rows=[];for(let i=0;i<7;i++){const at=new Date(Date.now()+i*86400000);rows.push({at,transit:await calculateCurrentTransits(data,{at})})}lastData=data;render(data,rows)}catch(err){const host=$('transitIntelligence');if(host){const el=document.createElement('div');el.className='tf-error';el.textContent=`Forecast error: ${err?.message||err}`;host.appendChild(el)}}finally{busy=false}}
function init(){setTimeout(refresh,2200);const result=$('result');if(result)new MutationObserver(()=>{if(window.__kundali&&!$('tiForecast')){lastData=null;refresh()}}).observe(result,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
