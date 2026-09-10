const EXALT={सूर्य:0,चन्द्र:1,मंगल:9,बुध:5,गुरु:3,शुक्र:11,शनि:6};
const OWN={सूर्य:[4],चन्द्र:[3],मंगल:[0,7],बुध:[2,5],गुरु:[8,11],शुक्र:[1,6],शनि:[9,10]};
const COMBUST={चन्द्र:12,मंगल:17,बुध:14,गुरु:11,शुक्र:10,शनि:15};
const LORDS=['मंगल','शुक्र','बुध','चन्द्र','सूर्य','बुध','शुक्र','मंगल','गुरु','शनि','शनि','गुरु'];
const RASHIS=['मेष','वृष','मिथुन','कर्कट','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुम्भ','मीन'];
const norm=n=>((Number(n)%360)+360)%360;
const angularDistance=(a,b)=>{const d=Math.abs(norm(a)-norm(b));return Math.min(d,360-d)};
export function houseFromLagna(sign,lagnaSign){return ((Number(sign)-Number(lagnaSign)+12)%12)+1}
export function dignityForPlanet(name,sign){if(name==='राहु'||name==='केतु')return 'node';if(EXALT[name]===sign)return 'exalted';if((EXALT[name]+6)%12===sign)return 'debilitated';if((OWN[name]||[]).includes(sign))return 'own';return 'neutral'}
export function combustionForPlanet(p,sun){if(!p||!sun||p.name==='सूर्य'||p.name==='राहु'||p.name==='केतु')return false;const limit=COMBUST[p.name];return !!limit&&angularDistance(p.longitude,sun.longitude)<=limit}
export function analyzePlanets(data){const lagna=Number(data?.ascendant?.sign??0),planets=data?.planets||[],sun=planets.find(p=>p.name==='सूर्य');return planets.map(p=>{const dignity=dignityForPlanet(p.name,Number(p.sign));return {...p,house:houseFromLagna(p.sign,lagna),dignity,combust:combustionForPlanet(p,sun)}})}
export function houseLords(lagnaSign=0){return Array.from({length:12},(_,i)=>{const sign=(Number(lagnaSign)+i)%12;return{house:i+1,sign,signName:RASHIS[sign],lord:LORDS[sign]}})}
const ASPECTS={मंगल:[4,7,8],गुरु:[5,7,9],शनि:[3,7,10]};
export function planetaryAspects(planets){const out=[];for(const p of planets||[]){const houses=ASPECTS[p.name]||[7];for(const offset of houses){const target=(Number(p.sign)+offset-1)%12;out.push({planet:p.name,fromSign:Number(p.sign),toSign:target,aspectHouse:offset})}}return out}
export const RASHI_LORDS=LORDS;
export const DIGNITY_LABELS={exalted:'उच्च',debilitated:'नीच',own:'स्वगृही',neutral:'सामान्य',node:'छाया ग्रह'};
