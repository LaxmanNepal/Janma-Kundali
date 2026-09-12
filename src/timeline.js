import { buildAllAntardashas } from './dasha-antardasha.js';
import { AREAS } from './life-areas.js';

const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
const areaForHouse=h=>Object.entries(AREAS).filter(([,a])=>a.houses.includes(Number(h))).map(([k])=>k);
const planetArea=(planet,area)=>AREAS[area]?.planets.includes(planet);
const level=n=>n>=78?'अति अनुकूल':n>=65?'अनुकूल':n>=50?'मध्यम':'सावधानी';
const dateInYear=(y)=>new Date(`${y}-07-01T00:00:00Z`);

function activePeriod(rows,date){return rows.find(x=>new Date(`${x.start}T00:00:00Z`)<=date&&new Date(`${x.end}T00:00:00Z`)>date)||null}
function dashaBoost(area,major,minor){let v=0;if(major&&planetArea(major,area))v+=12;if(minor&&planetArea(minor,area))v+=10;return v}
function eventBoost(area,events){let v=0;for(const e of events){if(!areaForHouse(e.house).includes(area))continue;v+=e.priority==='high'?7:e.priority==='medium'?4:2;if(planetArea(e.planet,area))v+=3;if(e.type==='retrograde')v-=1}return Math.max(-10,Math.min(28,v))}

export function buildTimeline(data,{events=[],strength=null,fromYear=2026,toYear=2036}={}){
 const majors=data?.dasha?.periods||[], minors=buildAllAntardashas(majors), baseStrength=(strength?.overall??50);
 return Array.from({length:toYear-fromYear+1},(_,i)=>{
  const year=fromYear+i,mid=dateInYear(year),major=activePeriod(majors,mid),minor=activePeriod(minors,mid),yearEvents=events.filter(e=>new Date(e.at).getUTCFullYear()===year);
  const areas=Object.keys(AREAS).map(key=>{const d=dashaBoost(key,major?.lord,minor?.lord),ev=eventBoost(key,yearEvents),planet=(strength?.planets||[]).filter(p=>AREAS[key].planets.includes(p.name));const ps=planet.length?planet.reduce((a,p)=>a+p.score,0)/planet.length:baseStrength;return{key,label:AREAS[key].label,score:clamp(45+d+ev+(ps-50)*.16),dasha:d,events:ev}}).sort((a,b)=>b.score-a.score);
  const top=areas[0],second=areas[1],score=clamp(areas.reduce((s,a)=>s+a.score,0)/areas.length),important=yearEvents.filter(e=>e.priority==='high').slice(0,4);
  return{year,score,level:level(score),major:major?.lord||'—',majorStart:major?.start||'',majorEnd:major?.end||'',minor:minor?.lord||'—',minorStart:minor?.start||'',minorEnd:minor?.end||'',topAreas:areas.slice(0,3),events:yearEvents,keyEvents:important,summary:`${year} मा ${top?.label||'जीवन'} मुख्य सक्रिय क्षेत्र देखिन्छ${second?` र ${second.label} पनि बलियो छ`:''}। ${major?.lord||'—'} महादशा / ${minor?.lord||'—'} अन्तरदशाको प्रभावलाई गोचर घटनासँग संयोजन गरिएको छ।`};
 });
}

export function timelineSummary(data,opts={}){const years=buildTimeline(data,opts);return{years,current:years.find(y=>y.year===new Date().getUTCFullYear())||years[0],best:years.reduce((a,b)=>b.score>a.score?b:a,years[0]),focus:years.reduce((a,b)=>b.score<a.score?b:a,years[0])};}
