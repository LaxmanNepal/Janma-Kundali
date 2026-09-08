const SIGN_LORDS=['मंगल','शुक्र','बुध','चन्द्र','सूर्य','बुध','शुक्र','मंगल','गुरु','शनि','शनि','गुरु'];
const KENDRA=[1,4,7,10],TRIKONA=[1,5,9],TRIK=[6,8,12];
function sign(p){return p?Math.floor(p.longitude/30):null}
function planet(data,name){return data.planets?.find(p=>p.name===name)}
function house(p,data){return p==null?null:((sign(p)-data.ascendant.sign+12)%12)+1}
function lord(data,h){const s=(data.ascendant.sign+h-1)%12;return {sign:s,name:SIGN_LORDS[s],planet:planet(data,SIGN_LORDS[s])}}
function connected(a,b){return !!a?.planet&&!!b?.planet&&sign(a.planet)===sign(b.planet)}
function add(out,name,type,text,details={}){out.push({name,type,text,confidence:'basic',...details})}
export function detectYogas(data){
 const out=[];const sun=planet(data,'सूर्य'),moon=planet(data,'चन्द्र'),mars=planet(data,'मंगल'),jupiter=planet(data,'गुरु'),mercury=planet(data,'बुध');
 if(sun&&mercury&&sign(sun)===sign(mercury))add(out,'बुध–आदित्य योग','बुद्धि/प्रतिष्ठा','सूर्य र बुध एउटै राशिमा हुँदा परम्परागत रूपमा बुद्धि, सञ्चार, अध्ययन र आत्मअभिव्यक्तिसँग सम्बन्धित योग मानिन्छ।');
 if(moon&&jupiter&&[0,3,6,9].includes((sign(jupiter)-sign(moon)+12)%12))add(out,'गजकेसरी योग','ज्ञान/प्रतिष्ठा','चन्द्रबाट गुरु केन्द्रमा हुँदा परम्परागत रूपमा ज्ञान, संरक्षण, निर्णय क्षमता र सामाजिक सम्मानसँग जोडेर पढिन्छ।');
 if(moon&&mars&&sign(moon)===sign(mars))add(out,'चन्द्र–मंगल योग','ऊर्जा/स्रोत','चन्द्र र मंगलको एउटै राशिस्थितिलाई परम्परागत रूपमा सक्रियता, साहस र आर्थिक पहलसँग जोडेर व्याख्या गरिन्छ।');
 const k=KENDRA.map(h=>lord(data,h)),t=TRIKONA.map(h=>lord(data,h));
 for(const a of k)for(const b of t)if(a.name!==b.name&&connected(a,b))add(out,'राज योग संकेत','केन्द्र–त्रिकोण','केन्द्र र त्रिकोणका स्वामीबीच सम्बन्ध देखिएकाले परम्परागत राजयोग नियमको आधारभूत संकेत भेटिन्छ।',{lords:[a.name,b.name]});
 const dhana=[lord(data,2),lord(data,11)];for(const a of dhana)for(const b of [lord(data,1),lord(data,5),lord(data,9),lord(data,10)])if(a.name!==b.name&&connected(a,b))add(out,'धन योग संकेत','स्रोत/समृद्धि','२औँ वा ११औँ भावका स्वामी र प्रमुख केन्द्र/त्रिकोण स्वामीबीच सम्बन्ध देखिन्छ; परम्परागत रूपमा स्रोत र उपलब्धिका विषयमा अध्ययन गरिन्छ।',{lords:[a.name,b.name]});
 for(const h of TRIK){const a=lord(data,h);if(a.planet&&TRIK.includes(house(a.planet,data)))add(out,'विपरीत राज योग संकेत','चुनौतीबाट अवसर','६, ८ वा १२ भावका स्वामी त्रिक भावमै रहेकाले परम्परागत Viparita Raja Yoga को आधारभूत संकेत देखिन्छ।',{lord:a.name,house:house(a.planet,data)});}
 return out.length?out:[{name:'मुख्य योग स्पष्ट छैन',type:'सामान्य',confidence:'basic',text:'हाल लागू गरिएका आधारभूत योग नियमबाट प्रमुख संयोजन भेटिएन। दृष्टि, ग्रहबल, भावेश, नवांश र दशा पनि संयुक्त रूपमा हेर्नुपर्छ।'}];
}
