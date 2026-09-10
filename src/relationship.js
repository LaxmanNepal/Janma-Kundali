const SIGN_LORDS=['मंगल','शुक्र','बुध','चन्द्र','सूर्य','बुध','शुक्र','मंगल','गुरु','शनि','शनि','गुरु'];
function houseFromLagna(p,data){return ((p.sign-data.ascendant.sign+12)%12)+1}
function planet(data,name){return data.planets?.find(p=>p.name===name)}
function lordInHouse(data,house){const sign=(data.ascendant.sign+house-1)%12;const lord=SIGN_LORDS[sign];const p=planet(data,lord);return {name:lord,lord,sign,house:p?houseFromLagna(p,data):null,planet:p}}
function manglik(data){const mars=planet(data,'मंगल'),venus=planet(data,'शुक्र');if(!mars)return {present:false,houses:[]};const refs=[data.ascendant?.sign,data.rashi?.sign,venus?.sign];const houses=refs.filter(Number.isInteger).map(sign=>((mars.sign-sign+12)%12)+1).filter(h=>[1,4,7,8,12].includes(h));return {present:houses.length>0,houses:[...new Set(houses)]}}
export function analyzeRelationship(data){
 if(!data?.ascendant||!data?.rashi)return {fifth:null,seventh:null,venus:null,mars:null,manglik:{present:false,houses:[]},strengths:[],cautions:[],note:'सम्बन्ध विश्लेषणका लागि जन्मकुण्डली data आवश्यक छ।'};
 const fifth=lordInHouse(data,5),seventh=lordInHouse(data,7),venus=planet(data,'शुक्र'),mars=planet(data,'मंगल');
 const venusHouse=venus?houseFromLagna(venus,data):null,marsHouse=mars?houseFromLagna(mars,data):null;
 const strengths=[],cautions=[];
 if(fifth.planet?.sign===seventh.sign) strengths.push('५औँ र ७औँ भावका स्वामी एउटै राशिमा छन्; प्रेम र साझेदारीका विषयलाई सँगै अध्ययन गर्न सकिन्छ।');
 if(venusHouse&&[1,5,7,9,10].includes(venusHouse)) strengths.push(`शुक्र ${venusHouse} भावमा भएकाले सम्बन्ध, आकर्षण र सामञ्जस्यका विषयमा सकारात्मक परम्परागत संकेतका रूपमा पढ्न सकिन्छ।`);
 if([6,8,12].includes(seventh.house)) cautions.push(`७औँ भावका स्वामी ${seventh.house} भावमा छन्; सम्बन्धमा धैर्य, स्पष्ट संवाद र जिम्मेवारीलाई विशेष महत्त्व दिन सकिन्छ।`);
 if(marsHouse&&[1,4,7,8,12].includes(marsHouse)) cautions.push(`मंगल ${marsHouse} भावमा भएकाले परम्परागत Manglik विश्लेषणमा यो स्थिति छुट्टै जाँचिन्छ।`);
 const m=manglik(data);return {fifth,seventh,venus:venus?{name:venus.name,sign:venus.sign,signName:venus.signName,house:venusHouse}:null,mars:mars?{name:mars.name,sign:mars.sign,signName:mars.signName,house:marsHouse}:null,manglik:m,strengths,cautions,note:'यो सम्बन्ध/विवाह विश्लेषण परम्परागत ज्योतिषीय संकेतको शैक्षिक सारांश हो। वास्तविक मिलानमा दुवै व्यक्तिको कुण्डली, नवांश, दशा, गोचर र Ashtakoota समेत हेर्नुपर्छ।'};
}
