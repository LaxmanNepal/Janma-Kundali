const SIGN_LORDS=['मंगल','शुक्र','बुध','चन्द्र','सूर्य','बुध','शुक्र','मंगल','गुरु','शनि','शनि','गुरु'];
const BENEFICS=new Set(['गुरु','शुक्र','बुध','चन्द्र']);
const norm=n=>((n%12)+12)%12;
const unique=a=>[...new Set(a)];
const houseOf=(planet,asc)=>norm(planet.sign-asc)+1;
export function detectYogas(data){
 const ps=data?.planets||[], asc=data?.ascendant?.sign;
 if(!ps.length||asc==null)return [];
 const byHouse=new Map(); for(const p of ps){const h=houseOf(p,asc);if(!byHouse.has(h))byHouse.set(h,[]);byHouse.get(h).push(p)}
 const find=name=>(ps.find(p=>p.name===name)||null);
 const out=[];
 const add=(key,name,importance,reason)=>out.push({key,name,importance,reason});
 const guru=find('गुरु'),shani=find('शनि'),mangal=find('मंगल'),budh=find('बुध'),shukra=find('शुक्र'),surya=find('सूर्य'),chandra=find('चन्द्र');
 const kendras=[1,4,7,10],trikonas=[1,5,9];
 const kendraBenefic=ps.filter(p=>kendras.includes(houseOf(p,asc))&&BENEFICS.has(p.name));
 if(kendraBenefic.length)add('gaja-kesari','गजकेसरी योग','high',`केन्द्र भावमा शुभ ग्रह ${unique(kendraBenefic.map(p=>p.name)).join(', ')} को स्थिति छ।`);
 const trK=ps.filter(p=>trikonas.includes(houseOf(p,asc))).map(p=>p.name);
 if(trK.includes('गुरु')&&trK.some(x=>x==='शुक्र'||x==='बुध'))add('dhana','धन योग','high','त्रिकोण क्षेत्रमा प्रमुख शुभ ग्रहहरूको सम्बन्ध/स्थिति देखिन्छ।');
 if(guru&&shani&&Math.abs(norm(guru.sign-shani.sign))%12===0)add('guru-shani','गुरु–शनि संयोग','medium','गुरु र शनि एउटै राशिमा छन्; परम्परागत रूपमा अनुशासन र विस्तारको मिश्रण मानिन्छ।');
 if(mangal&&shani&&mangal.sign===shani.sign)add('mangala-shani','मंगल–शनि संयोग','medium','मंगल र शनि एउटै राशिमा छन्; ऊर्जा र धैर्यबीच तनाव/अनुशासनको संकेतका रूपमा पढिन्छ।');
 const tenth=byHouse.get(10)||[];
 if(tenth.length>=2)add('raja-kendra','कर्म केन्द्र बल','medium',`दशम भावमा ${tenth.map(p=>p.name).join(', ')} छन्; करियर/प्रतिष्ठा विषयमा बलियो emphasis देखिन्छ।`);
 if([guru,shukra].some(Boolean)){
  const beneficTrikona=ps.filter(p=>trikonas.includes(houseOf(p,asc))&&BENEFICS.has(p.name));
  if(beneficTrikona.length>=2)add('shubha-trikona','शुभ त्रिकोण बल','medium',`त्रिकोणमा ${beneficTrikona.map(p=>p.name).join(', ')} को स्थिति छ।`);
 }
 if(chandra&&shukra&&chandra.sign===shukra.sign)add('chandra-shukra','चन्द्र–शुक्र संयोग','medium','चन्द्र र शुक्र एउटै राशिमा छन्; कला, सौन्दर्य र भावनात्मक अभिव्यक्तिको परम्परागत संकेत।');
 if(surya&&budh&&surya.sign===budh.sign)add('budha-aditya','बुध–आदित्य योग','high','सूर्य र बुध एउटै राशिमा छन्; बुद्धि, सञ्चार र विश्लेषणसँग जोडेर व्याख्या गरिन्छ।');
 return out;
}
export function yogaSummary(data){const yogas=detectYogas(data);return{count:yogas.length,high:yogas.filter(x=>x.importance==='high'),all:yogas};}
