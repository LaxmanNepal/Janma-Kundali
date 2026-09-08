const norm=n=>((n%360)+360)%360;
const RAD=Math.PI/180;
const DEG=180/Math.PI;
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));

function dayOfYear(date){const start=Date.UTC(date.getUTCFullYear(),0,1);return Math.floor((date.getTime()-start)/86400000)+1}
function solarDeclination(date){const n=dayOfYear(date);return 23.44*Math.sin((360/365)*(n-81)*RAD)}
function solarNoonUtc(date,lon,tz){const probe=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),12));const parts=new Intl.DateTimeFormat('en-US',{timeZone:tz,timeZoneName:'longOffset',hour:'2-digit'}).formatToParts(probe);const z=parts.find(p=>p.type==='timeZoneName')?.value||'GMT+00:00';const m=z.match(/GMT([+-])(\d{2})(?::?(\d{2}))?/);const off=m?(m[1]==='-'?-1:1)*(+m[2]+(+m[3]||0)/60):0;const eq=9.87*Math.sin(2*(2*Math.PI*(nFromDate(date)-81)/364))-7.53*Math.cos(2*Math.PI*(nFromDate(date)-81)/364)-1.5*Math.sin(2*Math.PI*(nFromDate(date)-81)/364);return 12-(lon/15)-eq/60-off}
function nFromDate(d){return dayOfYear(d)}
function riseSet(date,lat,lon,tz){const n=dayOfYear(date),B=(360/364)*(n-81)*RAD,eq=9.87*Math.sin(2*B)-7.53*Math.cos(B)-1.5*Math.sin(B),decl=23.45*Math.sin(B),latR=lat*RAD,declR=decl*RAD,zen=90.833*RAD,cosH=(Math.cos(zen)-Math.sin(latR)*Math.sin(declR))/(Math.cos(latR)*Math.cos(declR));if(cosH>1||cosH<-1)return{sunrise:null,sunset:null};const H=Math.acos(clamp(cosH,-1,1))*DEG/15;const utcNoon=12-lon/15-eq/60;const offset=zoneHours(date,tz);return{sunrise:localClock(utcNoon-H+offset),sunset:localClock(utcNoon+H+offset),dayLengthHours:2*H/15}}
function zoneHours(date,tz){const parts=new Intl.DateTimeFormat('en-US',{timeZone:tz,timeZoneName:'longOffset',hour:'2-digit'}).formatToParts(date),z=parts.find(p=>p.type==='timeZoneName')?.value||'GMT+00:00',m=z.match(/GMT([+-])(\d{2})(?::?(\d{2}))?/);return m?(m[1]==='-'?-1:1)*(+m[2]+(+m[3]||0)/60):0}
function localClock(decimal){let h=Math.floor(decimal),m=Math.round((decimal-h)*60);if(m===60){h++;m=0}h=((h%24)+24)%24;return`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`}
function intervalTime(date,minutes){const d=new Date(date.getTime()+minutes*60000);return d.toISOString()}

export function calculateDailyTimings(date,lat,lon,tz='Asia/Kathmandu'){
 const d=new Date(`${date}T12:00:00Z`),rs=riseSet(d,Number(lat),Number(lon),tz);if(!rs.sunrise||!rs.sunset)return{...rs,rahuKaal:null,yamaganda:null,gulika:null,choghadiya:[]};
 const [rh,rm]=rs.sunrise.split(':').map(Number),[sh,sm]=rs.sunset.split(':').map(Number);const sunriseMin=rh*60+rm,sunsetMin=sh*60+sm,dayLen=sunsetMin-sunriseMin,nightLen=1440-dayLen;const weekday=d.getUTCDay();const rahuParts=[8,2,7,5,6,4,3],yamaParts=[5,4,3,2,1,7,6],gulikaParts=[7,6,5,4,3,2,1];const slot=p=>{const start=sunriseMin+dayLen*p/8;return{start:localClock(start),end:localClock(start+dayLen/8)}};const rk=slot(rahuParts[weekday]-1),yg=slot(yamaParts[weekday]-1),gu=slot(gulikaParts[weekday]-1);const ch=[];const names=['उद्वेग','चर','लाभ','अमृत','काल','शुभ','रोग'];for(let i=0;i<8;i++){const a=sunriseMin+i*dayLen/8;ch.push({name:names[(i+(weekday===0?6:weekday-1))%7],start:localClock(a),end:localClock(a+dayLen/8),period:i+1})}return{...rs,rahuKaal:rk,yamaganda:yg,gulika:gu,choghadiya:ch,dayOfWeek:weekday}
}
export {riseSet,localClock};
