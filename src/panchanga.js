import { SwissEphemeris, Planet, SiderealMode, CalculationFlag } from '@swisseph/browser';

const norm=x=>((x%360)+360)%360;
const TITHI=['प्रतिपदा','द्वितीया','तृतीया','चतुर्थी','पञ्चमी','षष्ठी','सप्तमी','अष्टमी','नवमी','दशमी','एकादशी','द्वादशी','त्रयोदशी','चतुर्दशी','पूर्णिमा'];
const YOGA=['विष्कम्भ','प्रीति','आयुष्मान','सौभाग्य','शोभन','अतिगण्ड','सुकर्मा','धृति','शूल','गण्ड','वृद्धि','ध्रुव','व्याघात','हर्षण','वज्र','सिद्धि','व्यतीपात','वरीयान','परिघ','शिव','सिद्ध','साध्य','शुभ','शुक्ल','ब्रह्म','इन्द्र','वैधृति'];
const KARANA=['बव','बालव','कौलव','तैतिल','गर','वणिज','विष्टि','शकुनि','चतुष्पद','नाग','किंस्तुघ्न'];
const WEEK=['आइतबार','सोमबार','मंगलबार','बुधबार','बिहीबार','शुक्रबार','शनिबार'];
const zoneOffset=(date,tz)=>{const parts=new Intl.DateTimeFormat('en-US',{timeZone:tz,timeZoneName:'longOffset',hour:'2-digit'}).formatToParts(date),z=parts.find(p=>p.type==='timeZoneName')?.value||'GMT+00:00',m=z.match(/GMT([+-])(\d{2})(?::?(\d{2}))?/);return m?(m[1]==='-'?-1:1)*(+m[2]+(+m[3]||0)/60):0};
const localToUtc=(date,time,tz)=>{const[y,m,d]=date.split('-').map(Number),[hh,mm]=time.split(':').map(Number),n=new Date(Date.UTC(y,m-1,d,hh,mm)),o=zoneOffset(n,tz);return new Date(n.getTime()-o*3600000)};
const karanaAt=i=>i===0?'किंस्तुघ्न':i>=57?KARANA[7+(i-57)]:KARANA[(i-1)%7];
export async function calculatePanchanga(date,time,lat,lon,tz='Asia/Kathmandu'){
 const utc=localToUtc(date,time,tz),swe=new SwissEphemeris();await swe.init();swe.setSiderealMode(SiderealMode.Lahiri);const jd=swe.dateToJulianDay(utc);
 const sun=swe.calculatePosition(jd,Planet.Sun,CalculationFlag.Sidereal),moon=swe.calculatePosition(jd,Planet.Moon,CalculationFlag.Sidereal);const elong=norm(moon.longitude-sun.longitude),tithiIndex=Math.floor(elong/12),yogaIndex=Math.floor(norm(moon.longitude+sun.longitude)/(360/27)),half=Math.floor(elong/6),paksha=tithiIndex<15?'शुक्ल पक्ष':'कृष्ण पक्ष';
 return{vara:WEEK[new Date(`${date}T00:00:00`).getUTCDay()],tithi:tithiIndex%15===14?(tithiIndex<15?'पूर्णिमा':'अमावस्या'):TITHI[tithiIndex%15],tithiNumber:tithiIndex+1,paksha,yoga:YOGA[yogaIndex],karana:karanaAt(half),sunLongitude:norm(sun.longitude),moonLongitude:norm(moon.longitude),julianDay:jd,latitude:lat,longitude:lon,timezone:tz,utc:utc.toISOString(),note:'तिथि, योग र करण जन्म समयको sidereal Sun/Moon positions बाट गणना गरिन्छ।'};
}
export {TITHI,YOGA,KARANA,WEEK};
