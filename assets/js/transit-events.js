import { calculateCurrentTransits } from './astrology.js';

const PLANETS=['सूर्य','मंगल','बुध','गुरु','शुक्र','शनि','राहु','केतु'];
const PRIORITY={शनि:'high',गुरु:'high',राहु:'high',केतु:'high',बुध:'medium',मंगल:'medium',सूर्य:'normal',शुक्र:'normal'};
const LABEL={ingress:'राशि प्रवेश',retrograde:'वक्री सुरु',direct:'मार्गी सुरु'};
const STEP=86400000;
const cache=new WeakMap();
const eventType=(a,b)=>a.retrograde!==b.retrograde?(b.retrograde?'retrograde':'direct'):(a.sign!==b.sign?'ingress':null);
async function refine(natal,planet,start,end,type){
  let lo=start,hi=end;
  for(let i=0;i<13;i++){
    const mid=(lo+hi)/2;
    const snap=await calculateCurrentTransits(natal,{at:new Date(mid)});
    const p=snap.planets.find(x=>x.name===planet); if(!p)break;
    const ref=type==='ingress'?p.sign:p.retrograde;
    const left=await calculateCurrentTransits(natal,{at:new Date(lo)});
    const lp=left.planets.find(x=>x.name===planet); if(!lp)break;
    const lv=type==='ingress'?lp.sign:lp.retrograde;
    if(ref===lv)lo=mid;else hi=mid;
  }
  return new Date((lo+hi)/2);
}
export async function detectTransitEvents(natal,{from=new Date(),days=365}={}){
  if(!natal)return [];
  const start=new Date(from); start.setHours(0,0,0,0);
  const key=`${start.getTime()}-${days}`;
  const entry=cache.get(natal); if(entry?.key===key)return entry.promise;
  const promise=(async()=>{
    const end=new Date(start.getTime()+days*STEP),events=[]; let previous=null;
    for(let t=start.getTime();t<=end.getTime();t+=STEP){
      const snap=await calculateCurrentTransits(natal,{at:new Date(t)});
      const current=new Map(snap.planets.map(p=>[p.name,p]));
      if(previous){
        for(const name of PLANETS){
          const a=previous.get(name),b=current.get(name); if(!a||!b)continue;
          const type=eventType(a,b); if(!type)continue;
          const exact=await refine(natal,name,t-STEP,t,type);
          const exactSnap=await calculateCurrentTransits(natal,{at:exact});
          const ep=exactSnap.planets.find(x=>x.name===name)||b;
          events.push({id:`${name}-${type}-${exact.getTime()}`,planet:name,type,label:LABEL[type],priority:PRIORITY[name],at:exact.toISOString(),fromSign:a.signName,toSign:b.signName,sign:ep.sign,signName:ep.signName,house:ep.house,retrograde:ep.retrograde,theme:houseTheme(ep.house)});
        }
      }
      previous=current;
    }
    return events.sort((a,b)=>new Date(a.at)-new Date(b.at));
  })();
  cache.set(natal,{key,promise}); return promise;
}
function houseTheme(h){return({1:'स्व-छवि/शरीर',2:'धन/परिवार',3:'साहस/सञ्चार',4:'घर/मन',5:'सिर्जना/शिक्षा',6:'काम/स्वास्थ्य',7:'सम्बन्ध/साझेदारी',8:'परिवर्तन/गोप्य विषय',9:'भाग्य/उच्च शिक्षा',10:'करियर/प्रतिष्ठा',11:'लाभ/नेटवर्क',12:'खर्च/विश्राम'})[h]||'जीवन क्षेत्र'}
export const transitEventMeta={PLANETS,PRIORITY,LABEL};
