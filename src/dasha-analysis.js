const ORDER=['केतु','शुक्र','सूर्य','चन्द्र','मंगल','राहु','गुरु','शनि','बुध'];
const YEARS={केतु:7,शुक्र:20,सूर्य:6,चन्द्र:10,मंगल:7,राहु:18,गुरु:16,शनि:19,बुध:17};
const THEMES={सूर्य:'आत्मविश्वास, नेतृत्व र प्रतिष्ठासँग सम्बन्धित विषयमा सक्रियता',चन्द्र:'मन, परिवार, भावनात्मक स्थिरता र घरपरिवारमा ध्यान',मंगल:'ऊर्जा, साहस, प्रतिस्पर्धा र निर्णयमा तीव्रता',बुध:'सिकाइ, सञ्चार, व्यापार र विश्लेषणमा सक्रियता',गुरु:'ज्ञान, मार्गदर्शन, विस्तार र अवसरतर्फ वृद्धि',शुक्र:'सम्बन्ध, सुविधा, कला र आकर्षणतर्फ ध्यान',शनि:'जिम्मेवारी, अनुशासन, धैर्य र दीर्घकालीन निर्माण',राहु:'महत्त्वाकांक्षा, नयाँ अनुभव र असामान्य दिशातर्फ आकर्षण',केतु:'आत्मचिन्तन, अलगाव र प्राथमिकता पुनर्विचार'};
function house(p,data){return ((p.sign-data.ascendant.sign+12)%12)+1}
function planet(data,name){return data.planets?.find(p=>p.name===name)}
function connection(data,lords){const hs=lords.map(h=>((data.ascendant.sign+h-1)%12));return data.planets?.filter(p=>hs.includes(p.sign)).map(p=>p.name)||[]}
export function analyzeDasha(data){
 const periods=data.dasha?.periods||[];
 const current=periods.find(p=>{const now=new Date(),s=new Date(`${p.start}T00:00:00Z`),e=new Date(`${p.end}T00:00:00Z`);return now>=s&&now<e})||periods[0];
 const currentPlanet=current?planet(data,current.lord):null;
 const currentHouse=currentPlanet?house(currentPlanet,data):null;
 const seventhLord=[6,7,8,9,10,11,0,1,2,3,4,5][data.ascendant.sign];
 return {current,currentHouse,currentPlanet:currentPlanet?.name||current?.lord||'—',theme:THEMES[current?.lord]||'',seventhLordSign:seventhLord,periods,sequence:ORDER.map(lord=>({lord,years:YEARS[lord],theme:THEMES[lord]})),note:'दशा timing परम्परागत विम्शोत्तरी प्रणालीको आधारमा देखाइएको हो; वास्तविक फलादेशमा अन्तरदशा, भाव, ग्रहबल, दृष्टि र गोचर संयुक्त रूपमा हेर्नुपर्छ।'};
}
export function dashaAntardashaTimeline(data){
 const out=[];for(const md of data.dasha?.periods||[]){const start=new Date(`${md.start}T00:00:00Z`),totalYears=md.years||YEARS[md.lord];for(let i=0;i<9;i++){const lord=ORDER[(ORDER.indexOf(md.lord)+i)%9];const days=Math.max(1,Math.round(totalYears*YEARS[lord]/120*365.2425));const end=new Date(start.getTime()+days*86400000);out.push({mahadasha:md.lord,antardasha:lord,start:start.toISOString().slice(0,10),end:end.toISOString().slice(0,10),years:Number((days/365.2425).toFixed(2))});start.setTime(end.getTime())}}return out}
