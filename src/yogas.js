export function detectYogas(data){
 const ps=data.planets||[];
 const same=(a,b)=>ps.some(x=>x.name===a&&ps.some(y=>y.name===b&&Math.floor(x.longitude/30)===Math.floor(y.longitude/30)));
 const get=n=>ps.find(p=>p.name===n);
 const moon=get('चन्द्र'),jupiter=get('गुरु'),mars=get('मंगल'),sun=get('सूर्य'),mercury=get('बुध');
 const out=[];
 if(sun&&mercury&&Math.floor(sun.longitude/30)===Math.floor(mercury.longitude/30))out.push({name:'बुध–आदित्य योग',type:'बुद्धि/प्रतिष्ठा',text:'सूर्य र बुध एउटै राशिमा हुँदा परम्परागत रूपमा बुद्धि, सञ्चार, अध्ययन र आत्मअभिव्यक्तिसँग सम्बन्धित योग मानिन्छ।'});
 if(moon&&jupiter&&[0,3,6,9].includes((Math.floor(jupiter.longitude/30)-Math.floor(moon.longitude/30)+12)%12))out.push({name:'गजकेसरी योग',type:'ज्ञान/प्रतिष्ठा',text:'चन्द्रबाट गुरु केन्द्रमा हुँदा परम्परागत रूपमा ज्ञान, संरक्षण, निर्णय क्षमता र सामाजिक सम्मानसँग सम्बन्धित योग मानिन्छ।'});
 if(moon&&mars&&Math.floor(moon.longitude/30)===Math.floor(mars.longitude/30))out.push({name:'चन्द्र–मंगल योग',type:'ऊर्जा/स्रोत',text:'चन्द्र र मंगलको एउटै राशिस्थितिलाई परम्परागत रूपमा सक्रियता, साहस र आर्थिक पहलसँग जोडेर व्याख्या गरिन्छ।'});
 if(!out.length)out.push({name:'मुख्य योग स्पष्ट छैन',type:'सामान्य',text:'हाल लागू गरिएका सामान्य योग नियमबाट प्रमुख योग भेटिएन। अन्य दृष्टि, भावेश, नवांश र ग्रहबल पनि हेर्नुपर्छ।'});
 return out;
}