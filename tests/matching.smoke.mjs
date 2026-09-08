import assert from 'node:assert/strict';
import { calculateMatching } from '../src/matching.js';
const chart=(sign,nak)=>({rashi:{sign,signName:'test'},ascendant:{sign},moonNakshatra:{index:nak,name:'test'},planets:[{name:'मंगल',sign:(sign+3)%12},{name:'शुक्र',sign:(sign+5)%12}]});
const a=chart(0,0),b=chart(4,6),m=calculateMatching(a,b);
assert.equal(m.max,36);assert.equal(m.items.length,8);assert.ok(m.total>=0&&m.total<=36);assert.ok(m.percentage>=0&&m.percentage<=100);
console.log('matching smoke test passed',m.total+'/36');
