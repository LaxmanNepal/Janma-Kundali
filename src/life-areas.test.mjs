import assert from 'node:assert/strict';
import { analyzeLifeAreas, lifeAreaSummary } from './life-areas.js';
const data={ascendant:{sign:0},planets:[
 {name:'सूर्य',sign:0,retrograde:false},{name:'चन्द्र',sign:3,retrograde:false},{name:'मंगल',sign:9,retrograde:false},
 {name:'बुध',sign:2,retrograde:false},{name:'गुरु',sign:8,retrograde:false},{name:'शुक्र',sign:6,retrograde:false},{name:'शनि',sign:9,retrograde:true}
],dasha:{periods:[{lord:'गुरु',start:'2000-01-01T00:00:00Z',end:'2100-01-01T00:00:00Z'}]}};
const areas=analyzeLifeAreas(data,{planets:[]},{planets:[]});
assert.equal(areas.length,7);
assert.ok(areas.every(a=>a.score>=0&&a.score<=100));
assert.equal(lifeAreaSummary(data,{planets:[]},{planets:[]}).areas.length,7);
console.log('life area intelligence regression test passed');
