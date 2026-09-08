import { SwissEphemeris, Planet, SiderealMode, CalculationFlag } from '@swisseph/browser';

const norm=x=>((x%360)+360)%360;
const TITHI=['प्रतिपदा','द्वितीया','तृतीया','चतुर्थी','पञ्चमी','षष्ठी','सप्तमी','अष्टमी','नवमी','दशमी','एकादशी','द्वादशी','त्रयोदशी','चतुर्दशी','पूर्णिमा'];
const YOGA=['विष्कम्भ','प्रीति','आयुष्मान','सौभाग्य','शोभन','अतिगण्ड','सुकर्मा','धृति','शूल','गण्ड','वृद्धि','ध्रुव','व्याघात','हर्षण','वज्र','सिद्धि','व्यतीपात','वरीयान','परिघ','शिव','सिद्ध','साध्य','शुभ','शुक्ल','ब्रह्म','इन्द्र','वैधृति'];
const WEEK=['आइतबार','सोमबार','मंगलबार','बुधबार','बिहीबार','शुक्रबार','शनिबार'];
export async function calculatePanchanga(date,time,lat,lon,tz=5.75){
 const [y,m,d]=date.split('-').map(Number),[hh,mm]=time.split(':').map(Number);
 const utc=new Date(Date.UTC(y,m-1,d,hh-tz,mm)); const swe=new SwissEphemeris(); await swe.init(); swe.setSiderealMode(SiderealMode.Lahiri);
 const jd=swe.dateToJulianDay(utc); const sun=swe.calculatePosition(jd,Planet.Sun,CalculationFlag.Sidereal); const moon=swe.calculatePosition(jd,Planet.Moon,CalculationFlag.Sidereal);
 const elong=norm(moon.longitude-sun.longitude); const tithiIndex=Math.floor(elong/12); const paksha=tithiIndex<15?'शुक्ल पक्ष':'कृष्ण पक्ष';
 const yogaIndex=Math.floor(norm(moon.longitude+sun.longitude)/(360/27));
 return {vara:WEEK[utc.getUTCDay()],tithi:TITHI[tithiIndex%15],tithiNumber:tithiIndex+1,paksha,yoga:YOGA[yogaIndex],sunLongitude:norm(sun.longitude),moonLongitude:norm(moon.longitude),julianDay:jd};
}
