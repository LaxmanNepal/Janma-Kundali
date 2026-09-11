import assert from 'node:assert/strict';
import { dignityForPlanet, houseFromLagna, houseLords, planetaryAspects } from './planetary-strength.js';
assert.equal(dignityForPlanet('सूर्य',0),'exalted');
// सूर्यको नीच राशि तुला (राशि क्रमाङ्क 6) हो।
assert.equal(dignityForPlanet('सूर्य',6),'debilitated');
assert.equal(dignityForPlanet('मंगल',0),'own');
assert.equal(houseFromLagna(3,3),1);
assert.equal(houseFromLagna(4,3),2);
assert.equal(houseLords(0)[0].lord,'मंगल');
assert.equal(houseLords(0)[10].lord,'शनि');
const aspects=planetaryAspects([{name:'मंगल',sign:0}]);
assert.deepEqual(aspects.map(x=>x.aspectHouse),[4,7,8]);
console.log('planetary strength regression test passed');
