const EXALT={सूर्य:0,चन्द्र:1,मंगल:9,बुध:5,गुरु:3,शुक्र:11,शनि:6};
const OWN={सूर्य:[4],चन्द्र:[3],मंगल:[0,7],बुध:[2,5],गुरु:[8,11],शुक्र:[1,6],शनि:[9,10]};
const DEBIL={सूर्य:6,चन्द्र:7,मंगल:3,बुध:11,गुरु:9,शुक्र:5,शनि:0};
const COMBUST={चन्द्र:12,मंगल:17,बुध:14,गुरु:11,शुक्र:10,शनि:15};
const LORDS=['मंगल','शुक्र','बुध','चन्द्र','सूर्य','बुध','शुक्र','मंगल','गुरु','शनि','शनि','गुरु'];
const RASHIS=['मेष','वृष','मिथुन','कर्कट','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुम्भ','मीन'];
const BENEFICS=new Set(['गुरु','शुक्र','बुध','चन्द्र']);
const NATURAL_FRIENDS={सूर्य:new Set(['चन्द्र','मंगल','गुरु']),चन्द्र:new Set(['सूर्य','बुध']),मंगल:new Set(['सूर्य','चन्द्र','गुरु']),बुध:new Set(['सूर्य','शुक्र']),गुरु:new Set(['सूर्य','चन्द्र','मंगल']),शुक्र:new Set(['बुध','शनि']),शनि:new Set(['बुध','शुक्र'])};
const NATURAL_ENEMIES={सूर्य:new Set(['शुक्र','शनि']),चन्द्र:new Set(),मंगल:new Set(['बुध']),बुध:new Set(['चन्द्र']),गुरु:new Set(['बुध','शुक्र']),शुक्र:new Set(['सूर्य','चन्द्र']),शनि:new Set(['सूर्य','चन्द्र','मंगल'])};
const norm=n=>((Number(n)%360)+360)%360;
const angularDistance=(a,b)=>{const d=Math.abs(norm(a)-norm(b));return Math.min(d,360-d)};
export function houseFromLagna(sign,lagnaSign){return ((Number(sign)-Number(lagnaSign)+12)%12)+1}
export function dignityForPlanet(name,sign){if(name==='राहु'||name==='केतु')return 'node';if(EXALT[name]===sign)return 'exalted';if(DEBIL[name]===sign)return 'debilitated';if((OWN[name]||[]).includes(sign))return 'own';return 'neutral'}
export function combustionForPlanet(p,sun){if(!p||!sun||p.name==='सूर्य'||p.name==='राहु'||p.name==='केतु')return false;const limit=COMBUST[p.name];return !!limit&&angularDistance(p.longitude,sun.longitude)<=limit}
export function analyzePlanets(data){const lagna=Number(data?.ascendant?.sign??0),planets=data?.planets||[],sun=planets.find(p=>p.name==='सूर्य');return planets.map(p=>{const dignity=dignityForPlanet(p.name,Number(p.sign));return {...p,house:houseFromLagna(p.sign,lagna),dignity,combust:combustionForPlanet(p,sun)}})}
export function houseLords(lagnaSign=0){return Array.from({length:12},(_,i)=>{const sign=(Number(lagnaSign)+i)%12;return{house:i+1,sign,signName:RASHIS[sign],lord:LORDS[sign]}})}
const ASPECTS={मंगल:[4,7,8],गुरु:[5,7,9],शनि:[3,7,10]};
export function planetaryAspects(planets){const out=[];for(const p of planets||[]){const houses=ASPECTS[p.name]||[7];for(const offset of houses){const target=(Number(p.sign)+offset-1)%12;out.push({planet:p.name,fromSign:Number(p.sign),toSign:target,aspectHouse:offset})}}return out}
export const RASHI_LORDS=LORDS;
export const DIGNITY_LABELS={exalted:'उच्च',debilitated:'नीच',own:'स्वगृही',neutral:'सामान्य',node:'छाया ग्रह'};
const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
const DIGNITY_SCORE={exalted:100,own:82,neutral:55,debilitated:25,node:55};
const houseScore=h=>({1:82,2:65,3:62,4:78,5:86,6:58,7:78,8:42,9:88,10:90,11:84,12:40}[h]||55);
function relationScore(name,planets){const p=planets.find(x=>x.name===name);if(!p)return 55;const lord=LORDS[p.sign],friends=NATURAL_FRIENDS[name]||new Set(),enemies=NATURAL_ENEMIES[name]||new Set();let s=55;if(friends.has(lord))s+=22;else if(enemies.has(lord))s-=18;return clamp(s)}
function d9Sign(p){const sign=Number(p?.sign),deg=Number(p?.degree??0);if(!Number.isFinite(sign)||!Number.isFinite(deg))return null;const nav=Math.floor((deg/30)*9);const movable=[0,3,6,9].includes(sign),fixed=[1,4,7,10].includes(sign);const start=movable?sign:fixed?(sign+8)%12:(sign+4)%12;return (start+nav)%12}
export function d9Dignity(p){const s=d9Sign(p);return s==null?'neutral':dignityForPlanet(p.name,s)}
function vargaScore(p){const d=d9Dignity(p);return DIGNITY_SCORE[d]??55}
function ashtakavargaHeuristic(p){const h=houseFromLagna(p.sign,0);const base={1:5,2:4,3:4,4:4,5:5,6:3,7:4,8:2,9:5,10:5,11:6,12:2}[h]||3;return clamp(35+base*9)}
function yogaPlanetBonus(name,data){const yogas=data?.yogas||[];let n=0;for(const y of yogas){if(y.reason?.includes(name))n+=y.importance==='high'?10:5}return Math.min(20,n)}
export function analyzePlanetaryStrength(data){
 const planets=analyzePlanets(data); const enriched=planets.map(p=>{const dignityScore=DIGNITY_SCORE[p.dignity]??55;const houseScoreValue=houseScore(p.house);const d9=d9Dignity(p),vargaScoreValue=vargaScore(p);const relation=relationScore(p.name,planets);const av=ashtakavargaHeuristic(p);const combustionPenalty=p.combust?10:0;const score=clamp(dignityScore*.28+houseScoreValue*.20+vargaScoreValue*.18+relation*.12+av*.12+55*.10+Math.min(20,yogaPlanetBonus(p.name,data))-combustionPenalty);return {...p,dignityScore,houseScore:houseScoreValue,d9Dignity:d9,d9DignityLabel:DIGNITY_LABELS[d9]||'सामान्य',vargaScore:vargaScoreValue,relationScore:relation,ashtakavarga:av,score,summary:`${DIGNITY_LABELS[p.dignity]||'सामान्य'} स्थिति, ${p.house}H भाव र D9 को समर्थनको आधारमा ${score}/100 बल।${p.combust?' अस्त/combust भएकाले score मा सावधानी घटक समावेश छ।':''}`};});return enriched}
export function strengthSummary(data){const planets=analyzePlanetaryStrength(data);if(!planets.length)return{overall:0,planets:[],strongest:null,focus:null};const overall=clamp(planets.reduce((a,p)=>a+p.score,0)/planets.length);const strongest=[...planets].sort((a,b)=>b.score-a.score)[0];const focus=[...planets].sort((a,b)=>a.score-b.score)[0];return{overall,planets,strongest,focus}}
