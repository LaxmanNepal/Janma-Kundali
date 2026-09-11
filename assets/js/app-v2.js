import { calculateKundali, RASHIS, degText, loadLocations } from './astrology.js';
import { renderKundaliChart, renderNorthIndianVargaChart } from '../../src/chart-renderer.js';
import { calculatePanchanga } from '../../src/panchanga.js';
import { calculateVargas, VARGAS } from '../../src/varga.js';
import { calculateGochar } from '../../src/gochar.js';
import { BS_MONTHS, MIN_BS_YEAR, MAX_BS_YEAR, adStringToBs, bsToAdString, daysInMonth, bsDateValid } from './bs-date.js';

const $ = id => document.getElementById(id);
const monthNames = ['जनवरी','फेब्रुअरी','मार्च','अप्रिल','मे','जुन','जुलाई','अगस्ट','सेप्टेम्बर','अक्टोबर','नोभेम्बर','डिसेम्बर'];
let calendarMode = 'AD';
let chartMode = localStorage.getItem('jk-chart-mode') || 'north';

function showError(message, error) {
  console.error('[जन्म कुण्डली]', error || message);
  let box = $('runtimeError');
  if (!box) {
    box = document.createElement('div');
    box.id = 'runtimeError';
    box.className = 'accuracy-note';
    $('kundaliForm')?.appendChild(box);
  }
  box.textContent = message;
  box.hidden = false;
}
function clearError() { const box = $('runtimeError'); if (box) box.hidden = true; }

function populateDates() {
  const y=$('year'),m=$('month'),d=$('day'),by=$('bsYear'),bm=$('bsMonth');
  if (!y || !m || !d || !by || !bm) return;
  y.innerHTML=''; m.innerHTML=''; d.innerHTML=''; by.innerHTML=''; bm.innerHTML='';
  for(let i=1900;i<=2100;i++){const o=new Option(String(i),String(i));o.selected=i===2002;y.add(o)}
  monthNames.forEach((x,i)=>m.add(new Option(`${i+1} · ${x}`,String(i+1)))); m.value='3';
  for(let i=1;i<=31;i++)d.add(new Option(String(i),String(i))); d.value='18';
  for(let i=MIN_BS_YEAR;i<=MAX_BS_YEAR;i++){const o=new Option(String(i),String(i));o.selected=i===2083;by.add(o)}
  BS_MONTHS.forEach((x,i)=>bm.add(new Option(`${i+1} · ${x}`,String(i+1)))); bm.value='12'; updateBsDays();
}
function updateBsDays(){
  const y=$('bsYear'),m=$('bsMonth'),d=$('bsDay'); if(!y||!m||!d)return;
  const old=Number(d.value)||1; d.innerHTML=''; const max=daysInMonth(Number(y.value),Number(m.value));
  for(let i=1;i<=max;i++)d.add(new Option(String(i),String(i))); d.value=String(Math.min(old,max));
}
function validDate(y,m,d){const x=new Date(Date.UTC(y,m-1,d));return x.getUTCFullYear()===y&&x.getUTCMonth()===m-1&&x.getUTCDate()===d}
function setMode(mode){
  calendarMode=mode;$('adMode')?.classList.toggle('active',mode==='AD');$('bsMode')?.classList.toggle('active',mode==='BS');
  $('adDateFields')?.classList.toggle('hidden',mode!=='AD');$('bsDateFields')?.classList.toggle('hidden',mode!=='BS');
  if(mode==='BS'){
    const ad=`${$('year').value}-${String($('month').value).padStart(2,'0')}-${String($('day').value).padStart(2,'0')}`;const bs=adStringToBs(ad);
    $('bsYear').value=bs.year;$('bsMonth').value=bs.month;updateBsDays();$('bsDay').value=bs.day;
  }else{
    const ad=bsToAdString($('bsYear').value,$('bsMonth').value,$('bsDay').value);const [y,m,d]=ad.split('-').map(Number);
    $('year').value=y;$('month').value=m;$('day').value=d;
  }
}
function getBirthDate(){
  if(calendarMode==='AD'){
    const y=Number($('year').value),m=Number($('month').value),d=Number($('day').value);if(!validDate(y,m,d))throw Error('अमान्य AD मिति');
    return {date:`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`,display:`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`};
  }
  const y=Number($('bsYear').value),m=Number($('bsMonth').value),d=Number($('bsDay').value);if(!bsDateValid(y,m,d))throw Error('अमान्य BS मिति');
  const date=bsToAdString(y,m,d);return {date,display:`${y} ${BS_MONTHS[m-1]} ${d} → AD ${date}`};
}
function renderChart(data){
  renderKundaliChart($('chart'),data,chartMode);
  document.querySelectorAll('.chart-mode-btn').forEach(b=>b.classList.toggle('active',b.dataset.chartMode===chartMode));
}
function renderPlanets(data){
  const order=['सूर्य','चन्द्र','मंगल','बुध','गुरु','शुक्र','शनि','राहु','केतु'];
  $('planetTable').innerHTML=order.map(name=>{const p=data.planets.find(x=>x.name===name);return p?`<div class="planet-row"><span><b>${p.name}</b>${p.retrograde?' · वक्री':''}</span><span>${p.signName}</span><span>${degText(p.degree)}</span></div>`:''}).join('');
}
function renderBasicReport(data,birth,time,place){
  const name=$('name').value.trim()||'तपाईं';$('resultTitle').textContent=`${name} को जन्म कुण्डली`;
  $('resultMeta').textContent=`${birth.display} · ${time} · ${place}`;
  $('rashi').textContent=data.rashi.signName;$('rashiEn').textContent='चन्द्र राशि';
  $('nakshatra').textContent=data.moonNakshatra.name;$('nakshatraPada').textContent=`पाद ${data.moonNakshatra.pada} · ${data.moonNakshatra.lord}`;
  $('lagna').textContent=data.ascendant.signName;$('element').textContent=RASHIS[data.rashi.sign][2];$('quality').textContent=RASHIS[data.rashi.sign][3];
  renderChart(data);renderPlanets(data);$('result').classList.remove('hidden');$('result').scrollIntoView({behavior:'smooth',block:'start'});
}
function renderVargasSafe(data){
  try{
    const host=$('vargaReport');if(!host)return;const charts=calculateVargas(data.planets);let active=localStorage.getItem('jk-varga')||'D9';
    host.innerHTML=`<div class="panel varga-panel"><div class="panel-title"><div><h3>वर्ग कुण्डली · D1–D60</h3><span>उत्तर भारतीय कुण्डली</span></div><span id="vargaName">नवांश · D9</span></div><div class="varga-tabs">${VARGAS.map(v=>`<button type="button" class="varga-btn${v.key===active?' active':''}" data-varga="${v.key}">${v.key}</button>`).join('')}</div><div id="vargaContent"></div><p class="accuracy-note">केही वर्गका नियम परम्पराअनुसार फरक हुन सक्छन्।</p></div>`;
    const draw=key=>{const v=charts.find(x=>x.key===key)||charts[0];active=v.key;localStorage.setItem('jk-varga',active);const ascSign=Number(v.calc(data.ascendant.longitude));$('vargaName').textContent=`${v.name} · ${v.key}`;$('vargaContent').innerHTML=`<div class="varga-chart-wrap"><div class="varga-chart-toolbar"><span>उत्तर भारतीय कुण्डली</span><small>लग्न: ${RASHIS[ascSign][0]}</small></div><div id="activeVargaChart"></div></div>`;renderNorthIndianVargaChart($('activeVargaChart'),v.placements,ascSign,{title:`${v.name} · ${v.key}`});host.querySelectorAll('.varga-btn').forEach(b=>b.classList.toggle('active',b.dataset.varga===v.key))};
    host.querySelectorAll('.varga-btn').forEach(b=>b.addEventListener('click',()=>draw(b.dataset.varga)));draw(active);
  }catch(e){showError('वर्ग कुण्डली अहिले निकाल्न सकेन; मुख्य जन्म कुण्डली भने उपलब्ध छ।',e)}
}
async function renderOptional(data,birth,time){
  try{
    const p=await calculatePanchanga(birth.date,time,data.input.lat,data.input.lon,data.input.timezone||'Asia/Kathmandu');
    window.__panchanga=p;
    const t=p.timings||{};$('extendedReport').innerHTML=`<div class="panel"><div class="panel-title"><h3>पञ्चाङ्ग</h3><span>${p.vara}</span></div><div class="panchanga-grid"><div><small>तिथि</small><b>${p.tithi}</b><span>${p.paksha}</span></div><div><small>योग</small><b>${p.yoga}</b></div><div><small>करण</small><b>${p.karana}</b></div><div><small>नक्षत्र</small><b>${p.nakshatra}</b><span>पाद ${p.nakshatraPada}</span></div><div><small>सूर्योदय</small><b>${t.sunrise||'—'}</b></div><div><small>सूर्यास्त</small><b>${t.sunset||'—'}</b></div></div></div>`;
  }catch(e){$('extendedReport').innerHTML='<div class="panel accuracy-note">पञ्चाङ्ग सेवा उपलब्ध हुन सकेन। मुख्य कुण्डली सुरक्षित रूपमा तयार गरिएको छ।</div>';console.warn(e)}
  try{
    const now=new Date(),local=new Intl.DateTimeFormat('en-CA',{timeZone:data.input.timezone||'Asia/Kathmandu',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
    const g=await calculateGochar({date:local,time:'12:00',timezone:data.input.timezone||'Asia/Kathmandu',natalMoonSign:data.rashi.sign,natalLagnaSign:data.ascendant.sign});window.__gochar=g;
    const host=$('gocharReport');if(host)host.innerHTML=`<div class="panel gochar-panel"><div class="panel-title"><h3>गोचर</h3><span>${g.date} · लाहिरी निरयन</span></div><div class="gochar-summary"><div><small>शनि</small><b>${g.focus.saturn.signName}</b><span>${Math.floor(g.focus.saturn.degree)}°</span></div><div><small>गुरु</small><b>${g.focus.jupiter.signName}</b><span>${Math.floor(g.focus.jupiter.degree)}°</span></div><div><small>साढे साती</small><b>${g.sadeSati.active?'हो':'होइन'}</b><span>${g.sadeSati.phaseName}</span></div></div></div>`;
  }catch(e){$('gocharReport').innerHTML='<div class="panel accuracy-note">गोचर अहिले निकाल्न सकेन। मुख्य कुण्डली सुरक्षित रूपमा तयार गरिएको छ।</div>';console.warn(e)}
  renderVargasSafe(data);
}
async function generate(){
  const form=$('kundaliForm'),btn=form?.querySelector('button[type="submit"]');if(!btn)return;btn.disabled=true;btn.textContent='गणना हुँदैछ…';clearError();
  try{
    const birth=getBirthDate(),time=$('time').value||'12:00',place=$('place').value.trim()||'Kathmandu, Nepal';
    const data=await calculateKundali({date:birth.date,time,place});
    window.__kundali=data;
    renderBasicReport(data,birth,time,place);
    await renderOptional(data,birth,time);
  }catch(err){showError(`कुण्डली बनाउन सकिएन: ${err?.message||'अज्ञात त्रुटि'}। स्थान, मिति र समय जाँच गर्नुहोस्।`,err);}
  finally{btn.disabled=false;btn.innerHTML='कुण्डली निकाल्नुहोस् <span>✦</span>'}
}

$('kundaliForm')?.addEventListener('submit',e=>{e.preventDefault();generate()});
$('adMode')?.addEventListener('click',()=>setMode('AD'));$('bsMode')?.addEventListener('click',()=>setMode('BS'));$('bsYear')?.addEventListener('change',updateBsDays);$('bsMonth')?.addEventListener('change',updateBsDays);
$('demoBtn')?.addEventListener('click',()=>{$('name').value='Laxman';$('place').value='Hetauda, Nepal';$('time').value='08:30';$('year').value='2002';$('month').value='3';$('day').value='18';setMode('AD');generate()});
$('printBtn')?.addEventListener('click',()=>window.print());
$('themeBtn')?.addEventListener('click',()=>{$('body').classList.toggle('dark');$('themeBtn').textContent=document.body.classList.contains('dark')?'☀':'☾'});
document.querySelectorAll('.chart-mode-btn').forEach(b=>b.addEventListener('click',()=>{chartMode=b.dataset.chartMode;localStorage.setItem('jk-chart-mode',chartMode);if(window.__kundali)renderChart(window.__kundali)}));
populateDates();
loadLocations().then(loc=>{const dl=$('places');Object.keys(loc||{}).forEach(name=>dl?.appendChild(new Option(name,name)))}).catch(e=>console.warn('स्थान सूची लोड भएन',e));
