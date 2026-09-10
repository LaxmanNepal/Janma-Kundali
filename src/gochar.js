import { SwissEphemeris, Planet, LunarPoint, SiderealMode, CalculationFlag } from '@swisseph/browser';

const norm=n=>((n%360)+360)%360;
const signOf=lon=>Math.floor(norm(lon)/30);
const degree=lon=>norm(lon)%30;
const RASHIS=['मेष','वृष','मिथुन','कर्कट','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुम्भ','मीन'];
const NAK=['अश्विनी','भरणी','कृत्तिका','रोहिणी','मृगशिरा','आर्द्रा','पुनर्वसु','पुष्य','आश्लेषा','मघा','पूर्वाफाल्गुनी','उत्तराफाल्गुनी','हस्त','चित्रा','स्वाती','विशाखा','अनुराधा','ज्येष्ठा','मूल','पूर्वाषाढा','उत्तराषाढा','श्रवण','धनिष्ठा','शतभिषा','पूर्वाभाद्रपदा','उत्तराभाद्रपदा','रेवती'];
const PLANETS=[[Planet.Sun,'सूर्य'],[Planet.Moon,'चन्द्र'],[Planet.Mars,'मंगल'],[Planet.Mercury,'बुध'],[Planet.Jupiter,'गुरु'],[Planet.Venus,'शुक्र'],[Planet.Saturn,'शनि']];
const flags=CalculationFlag.Sidereal|CalculationFlag.Speed;
const nak=lon=>{const x=norm(lon),i=Math.min(26,Math.floor(x/(360/27))),p=Math.floor((x%(360/27))/((360/27)/4))+1;return{name:NAK[i],pada:p}};
function zoneOffset(date,tz){const parts=new Intl.DateTimeFormat('en-US',{timeZone:tz,timeZoneName:'longOffset',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date),z=parts.find(p=>p.type==='timeZoneName')?.value||'GMT+00:00',q=z.match(/GMT([+-])(\d{2})(?::?(\d{2}))?/);return q?(q[1]==='-'?-1:1)*(+q[2]+(+q[3]||0)/60):0}
function localToUtc(date,time,tz='Asia/Kathmandu'){
 const [y,m,d]=date.split('-').map(Number),[hh,mm]=time.split(':').map(Number);
 const naive=new Date(Date.UTC(y,m-1,d,hh,mm));
 let offset=zoneOffset(naive,tz),utc=new Date(naive.getTime()-offset*3600000);
 for(let i=0;i<3;i++){const corrected=zoneOffset(utc,tz);if(corrected===offset)break;offset=corrected;utc=new Date(naive.getTime()-offset*3600000)}
 return utc;
}
export async function calculateGochar({date,time='12:00',timezone='Asia/Kathmandu',natalMoonSign=null,natalLagnaSign=null}){
 const utc=localToUtc(date,time,timezone),swe=new SwissEphemeris();await swe.init();swe.setSiderealMode(SiderealMode.Lahiri);const jd=swe.dateToJulianDay(utc);
 const planets=PLANETS.map(([id,name])=>{const p=swe.calculatePosition(jd,id,flags),lon=norm(p.longitude),s=signOf(lon),n=nak(lon);return{id,name,longitude:lon,sign:s,signName:RASHIS[s],degree:degree(lon),nakshatra:n.name,pada:n.pada,retrograde:p.longitudeSpeed<0}});
 const node=swe.calculatePosition(jd,LunarPoint.TrueNode,flags),rahu=norm(node.longitude),ketu=norm(rahu+180);
 for(const [name,lon,id] of [['राहु',rahu,'rahu'],['केतु',ketu,'ketu']]){const s=signOf(lon),n=nak(lon);planets.push({id,name,longitude:lon,sign:s,signName:RASHIS[s],degree:degree(lon),nakshatra:n.name,pada:n.pada,retrograde:true});}
 const sat=planets.find(p=>p.name==='शनि'),jup=planets.find(p=>p.name==='गुरु');
 const moon=natalMoonSign==null?null:Number(natalMoonSign),lagna=natalLagnaSign==null?null:Number(natalLagnaSign);
 let sade={active:false,phase:null,phaseName:'सक्रिय छैन',relativeHouse:null};
 if(moon!==null&&!Number.isNaN(moon)){const rel=(sat.sign-moon+12)%12+1;sade.relativeHouse=rel;if(rel===12)sade={active:true,phase:1,phaseName:'पहिलो चरण · Rising',relativeHouse:12};else if(rel===1)sade={active:true,phase:2,phaseName:'दोस्रो चरण · Peak',relativeHouse:1};else if(rel===2)sade={active:true,phase:3,phaseName:'तेस्रो चरण · Setting',relativeHouse:2};}
 const dhaiya=moon===null?null:[4,8].includes((sat.sign-moon+12)%12+1);
 const transit=planets.map(p=>({...p,fromMoon:moon===null?null:((p.sign-moon+12)%12)+1,fromLagna:lagna===null?null:((p.sign-lagna+12)%12)+1}));
 return{date,time,timezone,utc:utc.toISOString(),engine:'Swiss Ephemeris WASM',sidereal:'Lahiri',nodeMethod:'True Node',planets:transit,sadeSati:sade,dhaiya,focus:{saturn:sat,jupiter:jup},natal:{moonSign:moon,lagnaSign:lagna}};
}
export {RASHIS,PLANETS,signOf,norm,localToUtc,zoneOffset};
