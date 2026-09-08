const HOUSE_TEXT={1:'आफू/व्यक्तित्व',2:'परिवार/धन',4:'घर/सुख',5:'प्रेम/सन्तान',7:'विवाह/साझेदारी',8:'गहिरो परिवर्तन',12:'निजी जीवन/त्याग'};
function houseOf(p,asc){return ((p.sign-asc+12)%12)+1}
function planet(data,name){return data.planets?.find(p=>p.name===name)}
function signName(data,i){return data.planets?.find(p=>p.sign===i)?.signName||['मेष','वृष','मिथुन','कर्कट','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुम्भ','मीन'][i]}
export function analyzeLoveMarriage(data){
 const asc=data.ascendant.sign, seventh=(asc+6)%12, fifth=(asc+4)%12;
 const venus=planet(data,'शुक्र'),mars=planet(data,'मंगल'),moon=planet(data,'चन्द्र'),jupiter=planet(data,'गुरु');
 const houses=data.planets.map(p=>({...p,house:houseOf(p,asc)}));
 const in7=houses.filter(p=>p.house===7),in5=houses.filter(p=>p.house===5);
 const indicators=[];
 if(in5.length) indicators.push(`५औँ भावमा ${in5.map(p=>p.name).join(', ')} भएकाले प्रेम/रोमान्स विषयमा ग्रहको प्रभावलाई परम्परागत रूपमा विचार गरिन्छ।`);
 if(in7.length) indicators.push(`७औँ भावमा ${in7.map(p=>p.name).join(', ')} छन्; विवाह र साझेदारीको interpretation मा यी ग्रहलाई विशेष रूपमा हेर्न सकिन्छ।`);
 if(venus) indicators.push(`शुक्र ${houseOf(venus,asc)}औँ भावमा छ; सम्बन्ध, आकर्षण र वैवाहिक सुखको विश्लेषणमा शुक्र प्रमुख संकेतक मानिन्छ।`);
 const loveScore=(in5.length?1:0)+(venus&&[1,5,7].includes(houseOf(venus,asc))?1:0)+(moon&&[1,5,7].includes(houseOf(moon,asc))?1:0);
 const marriageScore=(in7.length?1:0)+(venus&&[1,7].includes(houseOf(venus,asc))?1:0)+(jupiter&&[1,5,7,9].includes(houseOf(jupiter,asc))?1:0);
 let style=loveScore>=2?'प्रेम/भावनात्मक सम्बन्धतर्फ बलियो रुचि देखाउने संकेतहरू छन्।':loveScore===1?'प्रेम सम्बन्धका केही सकारात्मक संकेत छन्, तर सम्पूर्ण कुण्डलीसँगै हेर्नुपर्छ।':'प्रेम सम्बन्धबारे स्पष्ट निष्कर्षका लागि थप ग्रहबल/दृष्टि आवश्यक छ।';
 let marriage=marriageScore>=2?'विवाह/साझेदारी पक्षमा सहयोगी संकेतहरू देखिन्छन्।':marriageScore===1?'विवाह पक्षमा मिश्रित संकेत छन्।':'विवाहको विषयमा ७औँ भाव, भावेश, शुक्र र D9 लाई अझ गहिरो रूपमा हेर्नुपर्छ।';
 const manglik=!!data.planets.find(p=>p.name==='मंगल'&&[1,4,7,8,12].includes(houseOf(p,asc)));
 const d9=data.navamsa||[];
 return {seventhHouse:signName(data,seventh),fifthHouse:signName(data,fifth),loveSummary:style,marriageSummary:marriage,indicators,planets:houses.filter(p=>[5,7].includes(p.house)),manglik,navamsa:d9,disclaimer:'यो प्रेम/विवाह विश्लेषण परम्परागत ज्योतिषीय संकेतमा आधारित शैक्षिक व्याख्या हो। यसले विवाह हुने/नहुने वा निश्चित समयको ग्यारेन्टी गर्दैन।'};
}
