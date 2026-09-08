import { SwissEphemeris, Planet, SiderealMode, CalculationFlag } from '@swisseph/browser';
import { calculateDailyTimings } from './panchanga-extended.js';
const norm=x=>((x%360)+360)%360;
const TITHI=['प्रतिपदा','द्वितीया','तृतीया','चतुर्थी','पञ्चमी','षष्ठी','सप्तमी','अष्टमी','नवमी','दशमी','एकादशी','द्वादशी','त्रयोदशी','चतुर्दशी','पूर्णिमा'];
const YOGA=['विष्कम्भ','प्रीति','आयुष्मान','सौभाग्य','शोभन','अतिगण्ड','सुकर्मा','धृति','शूल','गण्ड','वृद्धि','ध्रुव','व्याघात','हर्षण','वज्र','सिद्धि','व्यतीपात','वरीयान','परिघ','शिव','सिद्ध','साध्य','शुभ','शुक्ल','ब्रह्म','इन्द्र','वैधृति'];
const KARANA=['बव','बालव','कौलव','तैतिल','गर','वणिज','विष्टि','शकुनि','चतुष्पद','नाग','किंस्तुघ्न'];
const NAKSHATRAS=['अश्विनी','भरणी','कृत्तिका','रोहिणी','मृगशिरा','आर्द्रा','पुनर्वसु','पुष्य','आश्लेषा','मघा','पूर्वाफाल्गुनी','उत्तराफाल्गुनी','हस्त','चित्रा','स्वाती','विशाखा','अनुराधा','ज्येष्ठा','मूल','पूर्वाषाढा','उत्तराषाढा','श्रवण','धनिष्ठा','शतभिषा','पूर्वाभाद्रपदा','उत्तराभाद्रपदा','रेवती'];
const WEEK=['आइतबार','सोमबार','मंगलबार','बुधबार','बिहीबार','शुक्रबार','शनिबार'];
const zoneOffset=(date,tz)=>{const parts=new Intl.DateTimeFormat('en-US',{timeZone:tz,timeZoneName:'longOffset',hour:'2-digit'}).formatToParts(date),z=parts.find(p=>p.type==='timeZoneName')?.value||'GMT+00:00',m=z.match(/GMT([+-])(\d{2})(?::?(\d{2}))?/);return m?(m[1]==='-'?-1:1)*(+m[2]+(+m[3]||0)/60):0};
const localToUtc=(date,time,tz)=>{const[y,m,d]=date.split('-').map(Number),[hh,mm]=time.split(':').map(Number),n=new Date(Date.UTC(y,m-1,d,hh,mm)),o=zoneOffset(n,tz);return new Date(n.getTime()-o*3600000)};
const karanaAt=i=>i===0?'किंस्तुघ्न':i>=57?KARANA[7+(i-57)]:KARANA[(i-1)%7];
const nakshatraAt=lon=>{const i=Math.floor(norm(lon)/(360/27));return{name:NAKSHATRAS[i],pada:Math.floor((norm(lon)%(360/27))/((360/27)/4))+1}};
export async function calculatePanchanga(date,time,lat,lon,tz='Asia/Kathmandu'){
 const utc=localToUtc(date,time,tz),swe=new SwissEphemeris();await swe.init();swe.setSiderealMode(SiderealMode.Lahiri);const jd=swe.dateToJulianDay(utc);
 const sun=swe.calculatePosition(jd,Planet.Sun,CalculationFlag.Sidereal),moon=swe.calculatePosition(jd,Planet.Moon,CalculationFlag.Sidereal),sunLongitude=norm(sun.longitude),moonLongitude=norm(moon.longitude),elong=norm(moonLongitude-sunLongitude),tithiNumber=Math.floor(elong/12)+1,half=Math.floor(elong/6),yogaIndex=Math.floor(norm(moonLongitude+sunLongitude)/(360/27)),nk=nakshatraAt(moonLongitude),timings=calculateDailyTimings(date,lat,lon,tz);
 return{vara:WEEK[new Date(`${date}T00:00:00Z`).getUTCDay()],tithi:tithiNumber===15?'पूर्णिमा':tithiNumber===30?'अमावस्या':TITHI[(tithiNumber-1)%15],tithiNumber,paksha:tithiNumber<=15?'शुक्ल पक्ष':'कृष्ण पक्ष',yoga:YOGA[yogaIndex],karana:karanaAt(half),nakshatra:nk.name,nakshatraPada:nk.pada,sunLongitude,moonLongitude,julianDay:jd,latitude:lat,longitude:lon,timezone:tz,utc:utc.toISOString(),timings,note:'तिथि, योग, करण र नक्षत्र Lahiri sidereal Sun/Moon positionsबाट गणना गरिन्छ। सूर्योदय, सूर्यास्त, राहु काल, यमगण्ड, गुलिक र चोघडिया स्थान/मिति/timezone अनुसार solar geometry बाट अनुमानित हुन्छन्।'};
}
export {TITHI,YOGA,KARANA,WEEK,NAKSHATRAS};
