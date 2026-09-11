const LABELS=new Map([
  ['January','जनवरी'],['February','फेब्रुअरी'],['March','मार्च'],['April','अप्रिल'],['May','मे'],['June','जुन'],['July','जुलाई'],['August','अगस्ट'],['September','सेप्टेम्बर'],['October','अक्टोबर'],['November','नोभेम्बर'],['December','डिसेम्बर'],
  ['North Indian','उत्तर भारतीय'],['South Indian','दक्षिण भारतीय'],['North Indian chart','उत्तर भारतीय कुण्डली'],['South Indian chart','दक्षिण भारतीय कुण्डली'],
  ['Sidereal','निरयन'],['Lahiri sidereal','लाहिरी निरयन'],['Sidereal · Lahiri','निरयन · लाहिरी'],['Lahiri','लाहिरी'],
  ['Gochar','गोचर'],['Gochar · Gochar','गोचर'],['Rahu Kaal','राहुकाल'],['Yamaganda','यमगण्ड'],['Gulika','गुलिक'],['Day length','दिन अवधि'],['Sunrise','सूर्योदय'],['Sunset','सूर्यास्त'],
  ['Planet','ग्रह'],['Planets','ग्रहहरू'],['House','भाव'],['Aspect','दृष्टि'],['Retrograde','वक्री'],['Combust','अस्त/दग्ध'],['Exalted','उच्च'],['Debilitated','नीच'],['Own sign','स्वगृही'],
  ['Vimshottari Dasha','विम्शोत्तरी दशा'],['Vimshottari','विम्शोत्तरी'],['Navamsa','नवांश'],['Rashi','राशी'],['Drekkana','द्रेष्काण'],['Chaturthamsa','चतुर्थांश'],['Saptamsa','सप्तमांश'],['Dasamsa','दशमांश'],['Dwadashamsa','द्वादशांश'],['Shodashamsa','षोडशांश'],['Vimsamsa','विंशांश'],['Chaturvimsamsa','चतुर्विंशांश'],['Bhamsa','भांश'],['Trimsamsa','त्रिंशांश'],['Khavedamsa','खवेदांश'],['Akshavedamsa','अक्षवेदांश'],['Shashtyamsa','षष्ट्यांश'],
  ['chart supported','चार्ट उपलब्ध'],['PDF / Print','PDF / छाप्नुहोस्'],['Print','छाप्नुहोस्'],['Built for Nepali users','नेपाली प्रयोगकर्ताका लागि'],['Practical','व्यावहारिक'],
  ['Confidence','विश्वसनीयता'],['basic','आधारभूत'],['Educational report','शैक्षिक रिपोर्ट'],['Traditional Vedic Jyotish interpretation','परम्परागत वैदिक ज्योतिषको शैक्षिक व्याख्या'],
  ['Mangalik','माङ्गलिक'],['Manglik','माङ्गलिक'],['Yoga','योग'],['Transit','गोचर'],['Dasha timing','दशा समय'],['Current Dasha','चलिरहेको दशा'],
  ['Aries','मेष'],['Taurus','वृष'],['Gemini','मिथुन'],['Cancer','कर्कट'],['Leo','सिंह'],['Virgo','कन्या'],['Libra','तुला'],['Scorpio','वृश्चिक'],['Sagittarius','धनु'],['Capricorn','मकर'],['Aquarius','कुम्भ'],['Pisces','मीन']
]);
function translate(root=document.body){if(!root)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const node of nodes){if(!node.nodeValue.trim())continue;let text=node.nodeValue;for(const [from,to] of LABELS)text=text.split(from).join(to);if(text!==node.nodeValue)node.nodeValue=text}}
translate();
new MutationObserver(mutations=>{for(const m of mutations)for(const n of m.addedNodes)if(n.nodeType===Node.ELEMENT_NODE)translate(n)}).observe(document.body,{subtree:true,childList:true});
