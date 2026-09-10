const RASHIS=['मेष','वृष','मिथुन','कर्कट','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुम्भ','मीन'];
const SHORT={सूर्य:'सू',चन्द्र:'चं',मंगल:'मं',बुध:'बु',गुरु:'गु',शुक्र:'शु',शनि:'श',राहु:'रा',केतु:'के'};
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const planetText=p=>`${SHORT[p.name]||String(p.name||'').slice(0,2)}${p.retrograde?'℞':''}`;
const byHouse=(data)=>{const houses=Array.from({length:12},()=>[]);const asc=Number(data?.ascendant?.sign??0);(data?.planets||[]).forEach(p=>{const sign=Number(p.sign);houses[(sign-asc+12)%12].push(p)});return houses};
const placementHouses=(placements,ascSign=0)=>{const houses=Array.from({length:12},()=>[]);(placements||[]).forEach(p=>{const sign=Number(p.sign);houses[(sign-ascSign+12)%12].push(p)});return houses};
const signLabel=(sign,showSigns)=>showSigns?RASHIS[sign]||'':' ';
const planetLines=items=>items.length?items.map(p=>`<tspan x="0" dy="16">${esc(planetText(p))}</tspan>`).join(''):'<tspan x="0" dy="16">—</tspan>';
const NORTH_PATHS=[
 {h:1,d:'M200 20 L380 200 L200 380 L20 200 Z'},
 {h:2,d:'M20 20 L200 20 L20 200 Z'},
 {h:3,d:'M20 20 L20 200 L100 120 Z'},
 {h:4,d:'M20 200 L100 120 L200 200 L100 280 Z'},
 {h:5,d:'M20 200 L20 380 L100 280 Z'},
 {h:6,d:'M20 380 L200 380 L100 280 Z'},
 {h:7,d:'M200 380 L380 200 L200 200 Z'},
 {h:8,d:'M380 380 L200 380 L300 280 Z'},
 {h:9,d:'M380 200 L380 380 L300 280 Z'},
 {h:10,d:'M380 200 L300 120 L200 200 L300 280 Z'},
 {h:11,d:'M380 20 L380 200 L300 120 Z'},
 {h:12,d:'M200 20 L380 20 L300 120 Z'}
];
const NORTH_TEXT=[
 [200,105],[76,74],[62,155],[105,200],[62,245],[76,326],[200,300],[324,326],[338,245],[295,200],[338,155],[324,74]
];
function northSvg(houses,title='D1 · राशि',showSigns=true){return `<svg class="north-kundali-svg" viewBox="0 0 400 400" role="img" aria-label="${esc(title)} North Indian Kundali"><rect x="10" y="10" width="380" height="380" rx="2" fill="none" class="nk-border"/><g class="nk-lines">${NORTH_PATHS.map(x=>`<path d="${x.d}"/>`).join('')}</g><g class="nk-cells">${houses.map((items,i)=>{const [x,y]=NORTH_TEXT[i];const sign=(i+Number(houses.ascSign||0))%12;return `<g class="nk-cell"><text x="${x}" y="${y-30}" text-anchor="middle" class="nk-house">${i+1}</text>${showSigns?`<text x="${x}" y="${y-12}" text-anchor="middle" class="nk-sign">${esc(RASHIS[sign])}</text>`:''}<text x="${x}" y="${y+4}" text-anchor="middle" class="nk-planets">${planetLines(items)}</text></g>`}).join('')}</g><text x="200" y="394" text-anchor="middle" class="nk-caption">${esc(title)}</text></svg>`}
export function renderNorthIndianChart(host,data,options={}){if(!host)return;const houses=byHouse(data);houses.ascSign=Number(data?.ascendant?.sign??0);host.innerHTML=`<div class="kundali-chart north-chart">${northSvg(houses,options.title||'D1 · राशि',options.showSigns!==false)}</div>`}
export function renderNorthIndianVargaChart(host,placements,ascSign=0,options={}){if(!host)return;const houses=placementHouses(placements,ascSign);houses.ascSign=Number(ascSign);host.innerHTML=`<div class="kundali-chart north-chart">${northSvg(houses,options.title||'वर्ग कुण्डली',options.showSigns!==false)}</div>`}
export function renderSouthIndianChart(host,data){if(!host)return;const asc=Number(data?.ascendant?.sign??0),houses=Array.from({length:12},()=>[]);(data?.planets||[]).forEach(p=>houses[Number(p.sign)].push(p));host.innerHTML=`<div class="kundali-chart south-chart" role="img" aria-label="South Indian D1 Kundali chart">${Array.from({length:16},(_,i)=>{if(i===5)return `<div class="south-center">लग्न<br><b>${esc(RASHIS[asc])}</b><small>D1 · राशि</small></div>`;if([0,1,2,3,4,6,7,8,9,10,11,12].includes(i)){const map=[0,1,2,3,4,5,6,7,8,9,10,11];const s=map[i===6?5:i<5?i:i-1];return `<div class="kundali-house"><span class="house-no">${s+1}</span><span class="house-sign">${esc(RASHIS[s])}</span><div class="house-planets">${houses[s].map(p=>`<span title="${esc(p.name)}">${esc(planetText(p))}</span>`).join('')}</div></div>`}return '<div class="south-empty"></div>'}).join('')}</div>`}
export function renderKundaliChart(host,data,mode='north',options={}){if(mode==='south')renderSouthIndianChart(host,data);else renderNorthIndianChart(host,data,options)}
export {RASHIS};
