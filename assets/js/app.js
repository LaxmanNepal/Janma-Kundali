import { calculateKundali, RASHIS, NAKSHATRAS, LOCATION, degText } from './astrology.js';

const $ = id => document.getElementById(id);
const months = ['बैशाख','जेठ','असार','श्रावण','भाद्र','आश्विन','कार्तिक','मंसिर','पुष','माघ','फाल्गुण','चैत्र'];

function populateDates(){
  const y=$('year'),m=$('month'),d=$('day');
  for(let i=1900;i<=2100;i++){const o=document.createElement('option');o.value=i;o.textContent=i;o.selected=i===2000;y.appendChild(o)}
  months.forEach((x,i)=>{const o=document.createElement('option');o.value=i+1;o.textContent=`${i+1} · ${x}`;m.appendChild(o)});
  m.value=3;
  for(let i=1;i<=31;i++){const o=document.createElement('option');o.value=i;o.textContent=i;d.appendChild(o)}
  d.value=18;
}

function renderChart(data){
  const chart=$('chart'); chart.innerHTML='';
  const asc=data.ascendant.sign;
  for(let i=0;i<12;i++){
    const el=document.createElement('span'); el.className='chart-label';
    const angle=-90+i*30; const r=42;
    el.style.left=`calc(50% + ${Math.cos(angle*Math.PI/180)*r}% - 28px)`;
    el.style.top=`calc(50% + ${Math.sin(angle*Math.PI/180)*r}% - 10px)`;
    el.innerHTML=`<b>${i+1}</b><small>${RASHIS[(asc+i)%12][0]}</small>`;
    chart.appendChild(el);
  }
  const center=document.createElement('span'); center.className='chart-center'; center.innerHTML=`लग्न<br><b>${RASHIS[asc][0]}</b>`; chart.appendChild(center);
}

function renderPlanets(data){
  const order=['सूर्य','चन्द्र','मंगल','बुध','गुरु','शुक्र','शनि','राहु','केतु'];
  $('planetTable').innerHTML=order.map(name=>{
    const p=data.planets.find(x=>x.name===name); if(!p)return '';
    return `<div class="planet-row"><span><b>${p.name}</b>${p.retrograde?' ℞':''}</span><span>${p.signName}</span><span>${degText(p.degree)}</span></div>`;
  }).join('');
}

function renderExtended(data){
  const panel=document.getElementById('extendedReport');
  if(!panel)return;
  const dash=data.dasha.periods.map(d=>`<div class="timeline-row"><b>${d.lord}</b><span>${d.start}</span><span>${d.end}</span><small>${d.years} वर्ष</small></div>`).join('');
  const nav=data.navamsa.map(p=>`<div class="mini-row"><span>${p.name}</span><b>${p.sign}</b></div>`).join('');
  panel.innerHTML=`<div class="panel"><div class="panel-title"><h3>विम्शोत्तरी दशा</h3><span>जन्म स्वामी: ${data.dasha.birthLord}</span></div><div class="timeline">${dash}</div></div><div class="panel"><div class="panel-title"><h3>नवांश (D9)</h3><span>Sidereal · Lahiri</span></div><div class="mini-grid">${nav}</div></div>`;
}

async function generate(){
  const name=$('name').value.trim()||'तपाईं';
  const date=`${$('year').value}-${String($('month').value).padStart(2,'0')}-${String($('day').value).padStart(2,'0')}`;
  const time=$('time').value||'12:00';
  const place=$('place').value.trim()||'Kathmandu, Nepal';
  const btn=$('kundaliForm').querySelector('button[type="submit"]');
  btn.disabled=true; btn.innerHTML='गणना हुँदैछ…';
  try{
    const data=await calculateKundali({date,time,place});
    window.__kundali=data;
    $('resultTitle').textContent=`${name} को जन्म कुण्डली`;
    $('resultMeta').textContent=`${date} · ${time} · ${place} · ${data.input.lat.toFixed(4)}, ${data.input.lon.toFixed(4)} · ${data.sidereal}`;
    $('rashi').textContent=data.rashi.signName; $('rashiEn').textContent=data.rashi.english;
    $('nakshatra').textContent=data.moonNakshatra.name; $('nakshatraPada').textContent=`पाद ${data.moonNakshatra.pada} · ${data.moonNakshatra.lord}`;
    $('lagna').textContent=data.ascendant.signName; $('element').textContent=RASHIS[data.rashi.sign][2]; $('quality').textContent=RASHIS[data.rashi.sign][3];
    renderChart(data); renderPlanets(data); renderExtended(data);
    $('result').classList.remove('hidden');
    $('result').scrollIntoView({behavior:'smooth',block:'start'});
  }catch(err){
    console.error(err);
    alert('कुण्डली गणना गर्न समस्या भयो। जन्म मिति/समय जाँच गर्नुहोस् र फेरि प्रयास गर्नुहोस्।');
  }finally{btn.disabled=false;btn.innerHTML='कुण्डली निकाल्नुहोस् <span>✦</span>'}
}

$('kundaliForm').addEventListener('submit',e=>{e.preventDefault();generate()});
$('demoBtn').addEventListener('click',()=>{$('name').value='Laxman';$('place').value='Hetauda, Nepal';$('time').value='08:30';$('year').value='2002';$('month').value='3';$('day').value='18';generate()});
$('printBtn').addEventListener('click',()=>window.print());
$('themeBtn').addEventListener('click',()=>{document.body.classList.toggle('dark');$('themeBtn').textContent=document.body.classList.contains('dark')?'☀':'☾'});
$('yearNow').textContent=new Date().getFullYear();
populateDates();
