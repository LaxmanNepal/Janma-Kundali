import assert from 'node:assert/strict';
import {detectYogas} from '../src/yogas.js';
import {analyzeRelationship} from '../src/relationship.js';
const data={ascendant:{sign:0,signName:'मेष'},rashi:{sign:1,signName:'वृष'},planets:[
 {name:'सूर्य',longitude:12,sign:0,signName:'मेष'},
 {name:'बुध',longitude:18,sign:0,signName:'मेष'},
 {name:'चन्द्र',longitude:42,sign:1,signName:'वृष'},
 {name:'मंगल',longitude:46,sign:1,signName:'वृष'},
 {name:'गुरु',longitude:135,sign:4,signName:'सिंह'},
 {name:'शुक्र',longitude:195,sign:6,signName:'तुला'},
 {name:'शनि',longitude:285,sign:9,signName:'मकर'}
]};
const yogas=detectYogas(data);assert.ok(yogas.length>0);assert.ok(yogas.some(x=>x.name.includes('बुध')));
const rel=analyzeRelationship(data);assert.equal(rel.fifth.name,'सूर्य');assert.equal(rel.seventh.name,'शुक्र');assert.ok(Array.isArray(rel.strengths));
console.log('analysis smoke test passed');
