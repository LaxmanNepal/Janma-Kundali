import { calculateCurrentTransits } from './astrology.js';
import { detectTransitEvents } from './transit-events.js';

const $=id=>document.getElementById(id);
const AREAS={career:{label:'करियर',houses:[6,10,11],icon:'💼'},finance:{label:'वित्त',houses:[2,5,9,11],icon:'💰'},marriage:{label:'विवाह',houses:[2,7,11],icon:'❤️'},health:{label:'स्वास्थ्य',houses:[1,6,8,12],icon:'🌿'},education:{label:'शिक्षा',houses:[4,5,9],icon:'📚'},travel:{label:'यात्रा',houses:[3,9,12],icon:'✈️'}};
const WEIGHT={सूर्य:8,चन्द्र:6,मंगल:8,बुध:6,गुरु:10,शुक्र:7,शनि:10,राहु:9,केतु:9};
const ICON={सूर्य:'☀️',चन्द्र:'🌙',मंगल:'♂️',बुध:'☿',गुरु:'♃',शुक्र:'♀️',शनि:'♄',राहु:'☊',केतु:'☋'};
const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
const level=n=>n>=72?'उच्च':n>=55?'मध्यम':'शान्त';
let state={data:null,events:[],rows:{today:[],week:[],month:[]},tab:'today',busy:false};

function areaScore(planets,houses){let s=50;for(const p of planets||[]){if(houses.includes(p.house)){const w=WEIGHT[p.name]||6;s+=p.retrograde?-w*.65:w*.8}}return clamp(s)}
function currentDasha(data){const now=Date.now(),periods=data?.dasha?.periods||[];return periods.find(p=>new Date(p.start).getTime()<=now&&new Date(p.end).getTime()>now)||null}
function explain(area,planets,dasha){
 const hits=(planets||[]).filter(p=>AREAS[area].houses.includes(p.house)).sort((a,b)=>(WEIGHT[b.name]||6)-(WEIGHT[a.name]||6));
 const lead=hits[0];
 if(!lead)return `${AREAS[area].label} का सम्बन्धित मुख्य भावमा अहिले प्रमुख transit hit देखिँदैन; योजना र स्थिरता प्राथमिकता दिनु उपयुक्त हुन्छ।`;
 const motion=lead.retrograde?'वक्री भएकाले पुनरावलोकन/सुधारको संकेत बलियो छ':'मार्गी भएकाले अघि बढ्ने संकेत सक्रिय छ';
 const d=dasha?` हाल ${dasha.lord} महादशा चलिरहेको छ।`:'';
 return `${ICON[lead.name]||'✦'} ${lead.name} ${lead.house}H मा ${motion}।${d}`;
}
function nextImportant(){return state.events.filter(e=>new Date(e.at)>Date.now()).sort((a,b)=>new Date(a.at)-new Date(b.at)).find(e=>e.priority==='high')||state.events.find(e=>new Date(e.at)>Date.now())}
function snapshot(rows){return rows?.[0]?.transit?.planets||[]}
function makeRows(data,kind){const dates=kind==='today'?[0]:kind==='week'?[0,1,2,3,4,5,6]:[0,7,14,21,30];return Promise.all(dates.map(async d=>{const at=new Date(Date.now()+d*86400000);return {at,transit:await calculateCurrentTransits(data,{at})}}))}
function tabTitle(){return state.tab==='today'?'आज':state.tab==='week'?'यो हप्ता':'यो महिना'}
function render(){
 const host=$('transitIntelligence');if(!host||!state.data)return;let el=$('personalIntelligence');if(!el){el=document.createElement('section');el.id='personalIntelligence';el.className='personal-intelligence';host.appendChild(el)}
 const data=state.data,dasha=currentDasha(data),rows=state.rows[state.tab]||[],p=snapshot(rows),next=nextImportant();
 const cards=Object.entries(AREAS).map(([key,a])=>{const s=areaScore(p,a.houses);return `<button class="pi-area" data-area="${key}"><span>${a.icon}</span><div><small>${a.label}</small><b>${s}</b></div><i><em style="width:${s}%"></em></i><strong>${level(s)}</strong></button>`}).join('');
 const influences=[...(p||[])].filter(x=>[1,5,7,9,10,11].includes(x.house)||x.natalAspects?.length).sort((a,b)=>(WEIGHT[b.name]||6)-(WEIGHT[a.name]||6)).slice(0,3).map(x=>`<div><span>${ICON[x.name]||'✦'}</span><b>${x.name}</b><small>${x.house}H · ${x.retrograde?'वक्री':'मार्गी'}${x.natalAspects?.length?' · natal aspect':''}</small></div>`).join('')||'<div class="pi-empty">मुख्य influence उपलब्ध छैन।</div>';
 el.innerHTML=`<div class="panel pi-panel"><div class="panel-title"><div><h3>🧠 Personal Astrology Intelligence</h3><span>Birth chart + Dasha + Gochar + upcoming events को unified overview</span></div><span class="ti-live">V4.9</span></div><div class="pi-tabs"><button class="${state.tab==='today'?'active':''}" data-tab="today">आज</button><button class="${state.tab==='week'?'active':''}" data-tab="week">यो हप्ता</button><button class="${state.tab==='month'?'active':''}" data-tab="month">यो महिना</button><button data-refresh>↻</button></div><div class="pi-summary"><div><small>हालको महादशा</small><b>${esc(dasha?.lord||'—')}</b><span>${dasha?new Intl.DateTimeFormat('ne-NP',{dateStyle:'medium'}).format(new Date(dasha.end))+' सम्म':'डेटा उपलब्ध छैन'}</span></div><div><small>मुख्य प्रभाव</small><b>${influences.split('</div>').length>1?'3':'—'}</b><span>transit signals</span></div><div><small>अर्को महत्त्वपूर्ण event</small><b>${next?`${ICON[next.planet]||'✦'} ${esc(next.planet)}`:'—'}</b><span>${next?esc(next.label):'event छैन'}</span></div></div><div class="ti-section-title"><b>🎯 ${tabTitle()} Life Areas</b><small>परम्परागत ज्योतिषीय heuristic score · 0–100</small></div><div class="pi-area-grid">${cards}</div><div class="pi-detail" id="piDetail"></div><div class="pi-columns"><div><div class="ti-section-title"><b>🔥 Top 3 Influences</b></div><div class="pi-influences">${influences}</div></div><div><div class="ti-section-title"><b>⏰ Next Important Event</b></div><div class="pi-next">${next?`<span>${ICON[next.planet]||'✦'}</span><div><b>${esc(next.planet)} · ${esc(next.label)}</b><small>${new Intl.DateTimeFormat('ne-NP',{dateStyle:'full',timeStyle:'short'}).format(new Date(next.at))}</small><em>${esc(next.fromSign||'')} → ${esc(next.toSign||'')} · ${esc(next.theme||'')}</em></div>`:'<span>✓</span><div><b>हाल प्रमुख event छैन</b><small>नियमित transit monitor जारी छ।</small></div>'}</div></div></div><p class="pi-note">यो व्यक्तिगत dashboard परम्परागत ज्योतिषीय interpretation का लागि heuristic overview हो। score भविष्यवाणी, medical advice वा वैज्ञानिक risk measurement होइन।</p></div>`;
 const show=key=>{const a=AREAS[key],s=areaScore(p,a.houses);el.querySelector('#piDetail').innerHTML=`<div><span>${a.icon}</span><div><small>${a.label} · ${level(s)} सक्रियता</small><b>${s}/100</b><p>${esc(explain(key,p,dasha))}</p></div></div>`};
 show('career');el.querySelectorAll('[data-area]').forEach(b=>b.onclick=()=>{el.querySelectorAll('.pi-area').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');show(b.dataset.area)});el.querySelectorAll('[data-tab]').forEach(b=>b.onclick=async()=>{state.tab=b.dataset.tab;await ensureRows();render()});el.querySelector('[data-refresh]').onclick=()=>refresh(true);
}
async function ensureRows(){const data=state.data;if(!data)return;if(!state.rows[state.tab]?.length)state.rows[state.tab]=await makeRows(data,state.tab)}
async function refresh(force=false){const data=window.__kundali;if(!data||state.busy)return;if(!force&&state.data===data&&state.events.length&&state.rows.today.length)return;state.busy=true;try{state.data=data;state.events=await detectTransitEvents(data,{days:365});state.rows.today=await makeRows(data,'today');state.rows.week=await makeRows(data,'week');state.rows.month=await makeRows(data,'month');render()}catch(e){const host=$('transitIntelligence');if(host){const el=document.createElement('div');el.className='pi-error';el.textContent=`Personal Intelligence error: ${e?.message||e}`;host.appendChild(el)}}finally{state.busy=false}}
function init(){setTimeout(()=>refresh(),2600);setInterval(()=>{if(state.data)refresh(true)},6*60*60*1000);const result=$('result');if(result)new MutationObserver(()=>{if(window.__kundali&&!$('personalIntelligence'))refresh(true)}).observe(result,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
