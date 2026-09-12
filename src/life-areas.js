const AREAS={
 career:{label:'करियर',icon:'💼',houses:[6,10,11],planets:['सूर्य','मंगल','बुध','गुरु','शनि']},
 finance:{label:'वित्त',icon:'💰',houses:[2,5,9,11],planets:['गुरु','शुक्र','बुध','शनि']},
 marriage:{label:'विवाह',icon:'❤️',houses:[2,7,11],planets:['शुक्र','गुरु','चन्द्र','बुध']},
 health:{label:'स्वास्थ्य',icon:'🌿',houses:[1,6,8,12],planets:['सूर्य','चन्द्र','मंगल','शनि']},
 education:{label:'शिक्षा',icon:'📚',houses:[4,5,9],planets:['बुध','गुरु','चन्द्र']},
 travel:{label:'यात्रा',icon:'✈️',houses:[3,9,12],planets:['चन्द्र','बुध','राहु','केतु']},
 business:{label:'व्यवसाय',icon:'🚀',houses:[2,7,10,11],planets:['बुध','शुक्र','गुरु','मंगल']}
};
const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
const level=n=>n>=75?'उच्च':n>=60?'बलियो':n>=45?'मध्यम':'ध्यान आवश्यक';
const houseOf=(sign,asc)=>((Number(sign)-Number(asc)+12)%12)+1;
function strengthMap(data){return new Map((data?.planets||[]).map(p=>[p.name,p]));}
function natalSignal(data,area){
 const asc=Number(data?.ascendant?.sign??0), ps=data?.planets||[], cfg=AREAS[area]; let score=50; const hits=[];
 for(const p of ps){const h=houseOf(p.sign,asc);if(cfg.houses.includes(h)){let v=7;if(cfg.planets.includes(p.name))v+=5;if(p.retrograde)v-=3;if(p.name==='राहु'||p.name==='केतु')v-=2;score+=v;hits.push({planet:p.name,house:h,impact:v})}}
 return {score:clamp(score),hits};
}
function dashaSignal(data,area){
 const periods=data?.dasha?.periods||[],now=Date.now(),d=periods.find(p=>new Date(p.start)<=now&&new Date(p.end)>now);if(!d)return{score:50,lord:null};
 const cfg=AREAS[area],f=cfg.planets.includes(d.lord);return{score:clamp(50+(f?14:-4)),lord:d.lord};
}
function transitSignal(transit,area){
 const cfg=AREAS[area];let score=50;const hits=[];for(const p of transit?.planets||[]){if(cfg.houses.includes(Number(p.house))){let v=p.retrograde?-5:5;if(cfg.planets.includes(p.name))v+=4;score+=v;hits.push({planet:p.name,house:p.house,impact:v})}}return{score:clamp(score),hits};
}
function yogaSignal(data,area){const yogas=data?.yogas||[];let score=0;for(const y of yogas){const text=`${y.name||''} ${y.reason||''}`;if((area==='career'&&/कर्म|करियर|प्रतिष्ठा|सूर्य|शनि|मंगल/.test(text))||(area==='finance'&&/धन|गुरु|शुक्र|लाभ/.test(text))||(area==='marriage'&&/विवाह|शुक्र|चन्द्र/.test(text))||(area==='education'&&/बुध|गुरु|शिक्षा/.test(text))||(area==='business'&&/बुध|शुक्र|मंगल|गुरु/.test(text)))score+=y.importance==='high'?8:4}return clamp(score)}
export function analyzeLifeAreas(data,transit=null,strength=null){
 const out=Object.entries(AREAS).map(([key,cfg])=>{const natal=natalSignal(data,key),dash=dashaSignal(data,key),tr=transitSignal(transit,key),ys=yogaSignal(data,key);const planetScores=(strength?.planets||[]).filter(p=>cfg.planets.includes(p.name)).map(p=>p.score);const ps=planetScores.length?planetScores.reduce((a,b)=>a+b,0)/planetScores.length:50;const score=clamp(natal.score*.28+dash.score*.18+tr.score*.24+ps*.20+(50+ys)*.10);const hits=[...natal.hits,...tr.hits].sort((a,b)=>Math.abs(b.impact)-Math.abs(a.impact));return{key,label:cfg.label,icon:cfg.icon,score,level:level(score),natalScore:natal.score,dashaScore:dash.score,transitScore:tr.score,planetScore:Math.round(ps),yogaScore:ys,dashaLord:dash.lord,influences:hits.slice(0,4),summary:summary(cfg,score,hits,dash.lord)};});return out.sort((a,b)=>b.score-a.score);
}
function summary(cfg,score,hits,lord){const lead=hits[0];if(lead)return `${cfg.label} क्षेत्रमा ${lead.planet} को ${lead.house}H activation देखिन्छ; समग्र संकेत ${level(score)} छ${lord?` र ${lord} महादशा चलिरहेको छ`:''}।`;return `${cfg.label} का मुख्य भावमा तत्काल बलियो transit hit कम छ; स्थिर योजना र निरन्तरता प्राथमिकता दिनु उपयुक्त हुन्छ।${lord?` ${lord} महादशा सक्रिय छ।`:''}`}
export function lifeAreaSummary(data,transit=null,strength=null){const areas=analyzeLifeAreas(data,transit,strength);return{areas,strongest:areas[0]||null,focus:areas[areas.length-1]||null,overall:areas.length?clamp(areas.reduce((a,x)=>a+x.score,0)/areas.length):0};}
export {AREAS};
