import assert from 'node:assert/strict';
import { dignityForPlanet, houseFromLagna, houseLords, planetaryAspects, strengthSummary, d9Dignity } from './planetary-strength.js';
assert.equal(dignityForPlanet('सूर्य',0),'exalted');
assert.equal(dignityForPlanet('सूर्य',6),'debilitated');
assert.equal(dignityForPlanet('मंगल',0),'own');
assert.equal(houseFromLagna(3,3),1);
assert.equal(houseFromLagna(4,3),2);
assert.equal(houseLords(0)[0].lord,'मंगल');
assert.equal(houseLords(0)[10].lord,'शनि');
const aspects=planetaryAspects([{name:'मंगल',sign:0}]);
assert.deepEqual(aspects.map(x=>x.aspectHouse),[4,7,8]);
const synthetic={ascendant:{sign:0},planets:[
 {name:'सूर्य',sign:0,degree:5,longitude:5},
 {name:'चन्द्र',sign:1,degree:10,longitude:40},
 {name:'मंगल',sign:0,degree:20,longitude:20},
 {name:'बुध',sign:5,degree:10,longitude:160},
 {name:'गुरु',sign:3,degree:12,longitude:102},
 {name:'शुक्र',sign:11,degree:12,longitude:342},
 {name:'शनि',sign:6,degree:12,longitude:192}
]};
const summary=strengthSummary(synthetic);
assert.equal(summary.planets.length,7);
assert.ok(summary.overall>=0&&summary.overall<=100);
assert.ok(summary.strongest.score>=summary.focus.score);
assert.equal(d9Dignity(synthetic.planets[0]),'neutral');
console.log('planetary strength regression test passed');
