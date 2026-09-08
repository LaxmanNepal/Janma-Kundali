const SIGN_NAMES=['मेष','वृष','मिथुन','कर्कट','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुम्भ','मीन'];
const THEMES={सूर्य:'आत्मअभिव्यक्ति र नेतृत्व',चन्द्र:'मन र दैनिक प्रतिक्रिया',मंगल:'कार्य, ऊर्जा र प्रतिस्पर्धा',बुध:'सञ्चार र निर्णय',गुरु:'विस्तार, ज्ञान र अवसर',शुक्र:'सम्बन्ध, कला र सुविधा',शनि:'अनुशासन, जिम्मेवारी र दीर्घकालीन काम',राहु:'नयाँ अनुभव र तीव्र महत्वाकांक्षा',केतु:'छोड्ने, पुनर्विचार गर्ने र आत्मचिन्तन'};
function relativeHouse(transit,natal){return ((transit.sign-natal.sign+12)%12)+1}
export function analyzeTransits(gochar,data){
 if(!gochar?.planets||!data)return {items:[],sadeSati:null,note:'गोचर data उपलब्ध छैन।'};
 const items=gochar.planets.map(p=>{const natal=data.planets?.find(n=>n.name===p.name);return {...p,fromMoon:relativeHouse(p,data.rashi),fromLagna:relativeHouse(p,data.ascendant),theme:THEMES[p.name]||''}});
 const slow=items.filter(p=>['गुरु','शनि','राहु','केतु'].includes(p.name));
 return {items,slow,note:'गोचरलाई जन्म चन्द्र राशि र लग्नबाट भाव गणना गरी शैक्षिक संकेतका रूपमा देखाइएको छ। निश्चित भविष्यवाणी होइन।'};
}
export function transitHighlights(gochar,data){const a=analyzeTransits(gochar,data);return a.items.filter(p=>[1,4,5,7,9,10].includes(p.fromMoon)||[1,4,7,10].includes(p.fromLagna)).slice(0,6)}
