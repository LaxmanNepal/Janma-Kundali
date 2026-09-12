const ORDER=['केतु','शुक्र','सूर्य','चन्द्र','मंगल','राहु','गुरु','शनि','बुध'];
const YEARS={केतु:7,शुक्र:20,सूर्य:6,चन्द्र:10,मंगल:7,राहु:18,गुरु:16,शनि:19,बुध:17};
const MS_YEAR=365.2425*86400000;

export function buildAntardashas(major){
 if(!major?.lord||!major?.start||!major?.end)return [];
 const start=new Date(`${major.start}T00:00:00Z`),end=new Date(`${major.end}T00:00:00Z`);
 const total=end-start,idx=ORDER.indexOf(major.lord); if(idx<0||total<=0)return [];
 let cursor=start;
 return ORDER.map((_,i)=>{
  const lord=ORDER[(idx+i)%ORDER.length],duration=total*(YEARS[lord]/120),next=i===8?end:new Date(cursor.getTime()+duration);
  const row={mahadashaLord:major.lord,lord,start:cursor.toISOString().slice(0,10),end:next.toISOString().slice(0,10),years:Number((duration/MS_YEAR).toFixed(4))};
  cursor=next; return row;
 });
}

export function buildAllAntardashas(periods=[]){return periods.flatMap(buildAntardashas)}
export {ORDER as DASHA_ORDER,YEARS as DASHA_YEARS};
