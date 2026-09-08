const norm=n=>((n%360)+360)%360;
const signOf=lon=>Math.floor(norm(lon)/30);
const degInSign=lon=>norm(lon)%30;
export const zodiac=['मेष','वृष','मिथुन','कर्कट','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुम्भ','मीन'];
const part=(lon,d)=>Math.min(d-1,Math.floor(degInSign(lon)/(30/d)));
const div=(lon,rule,d)=>norm(rule(signOf(lon),part(lon,d),d));
const kendra=s=>[0,3,6,9].includes(s)?s:[1,4,7,10].includes(s)?(s+3)%12:(s+6)%12;
const d1=signOf;
const d2=lon=>{const s=signOf(lon),p=part(lon,2);return ((s%2===0?p===0:p===1)?4:3)};
const d3=lon=>div(lon,(s,p)=>s+[0,4,8][p],3);
const d4=lon=>div(lon,(s,p)=>kendra(s)+p*3,4);
const d7=lon=>div(lon,(s,p)=>(s%2===0?s:(s+6)%12)+p,7);
const d9=lon=>{const s=signOf(lon),p=part(lon,9),start=[0,3,6,9].includes(s)?s:[1,4,7,10].includes(s)?(s+8)%12:(s+4)%12;return(start+p)%12};
const d10=lon=>div(lon,(s,p)=>(s%2===0?s:(s+8)%12)+p,10);
const d12=lon=>div(lon,(s,p)=>s+p,12);
const d16=lon=>div(lon,(s,p)=>kendra(s)+p,16);
const d20=lon=>{const s=signOf(lon),p=part(lon,20),start=[0,3,6,9].includes(s)?s:[1,4,7,10].includes(s)?(s+8)%12:(s+4)%12;return(start+p)%12};
const d24=lon=>div(lon,(s,p)=>(s%2===0?s:(s+3)%12)+p,24);
const d27=lon=>{const s=signOf(lon),p=part(lon,27),start=[0,3,6,9][s%4];return(start+p)%12};
const d30=lon=>{const s=signOf(lon),d=degInSign(lon);if(s%2===0)return d<5?0:d<10?10:d<18?8:d<25?2:1;return d<5?1:d<10?2:d<18?8:d<25?10:0};
const d40=lon=>div(lon,(s,p)=>(s%2===0?s:(s+6)%12)+p,40);
const d45=lon=>div(lon,(s,p)=>(s%2===0?s:(s+4)%12)+p,45);
const d60=lon=>div(lon,(s,p)=>(s%2===0?s:(s+6)%12)+p,60);
export const VARGAS=[
 {key:'D1',name:'राशी',english:'Rashi',divisions:1,calc:d1},
 {key:'D2',name:'होरा',english:'Hora',divisions:2,calc:d2},
 {key:'D3',name:'द्रेष्काण',english:'Drekkana',divisions:3,calc:d3},
 {key:'D4',name:'चतुर्थांश',english:'Chaturthamsa',divisions:4,calc:d4},
 {key:'D7',name:'सप्तमांश',english:'Saptamsa',divisions:7,calc:d7},
 {key:'D9',name:'नवांश',english:'Navamsa',divisions:9,calc:d9},
 {key:'D10',name:'दशमांश',english:'Dasamsa',divisions:10,calc:d10},
 {key:'D12',name:'द्वादशांश',english:'Dwadashamsa',divisions:12,calc:d12},
 {key:'D16',name:'षोडशांश',english:'Shodashamsa',divisions:16,calc:d16},
 {key:'D20',name:'विंशांश',english:'Vimsamsa',divisions:20,calc:d20},
 {key:'D24',name:'चतुर्विंशांश',english:'Chaturvimsamsa',divisions:24,calc:d24},
 {key:'D27',name:'भांश',english:'Bhamsa',divisions:27,calc:d27},
 {key:'D30',name:'त्रिंशांश',english:'Trimsamsa',divisions:30,calc:d30},
 {key:'D40',name:'खवेदांश',english:'Khavedamsa',divisions:40,calc:d40},
 {key:'D45',name:'अक्षवेदांश',english:'Akshavedamsa',divisions:45,calc:d45},
 {key:'D60',name:'षष्ट्यांश',english:'Shashtyamsa',divisions:60,calc:d60}
];
export function calculateVargas(planets){return VARGAS.map(v=>({...v,placements:planets.map(p=>{const sign=v.calc(p.longitude);return{id:p.id,name:p.name,natalLongitude:norm(p.longitude),sign,signName:zodiac[sign]}})}))}
export {norm,signOf,degInSign,d1,d2,d3,d4,d7,d9,d10,d12,d16,d20,d24,d27,d30,d40,d45,d60};
