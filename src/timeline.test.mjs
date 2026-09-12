import assert from 'node:assert/strict';
import { buildAntardashas } from './dasha-antardasha.js';
import { buildTimeline } from './timeline.js';

const major={lord:'गुरु',start:'2025-01-01',end:'2041-01-01',years:16};
const ad=buildAntardashas(major);
assert.equal(ad.length,9);
assert.equal(ad[0].lord,'गुरु');
assert.equal(ad[8].end,major.end);
assert.equal(ad.reduce((sum,x)=>sum+x.years,0).toFixed(3),'16.000');

const data={dasha:{periods:[major]},planets:[],ascendant:{sign:0}};
const rows=buildTimeline(data,{events:[],strength:{overall:50,planets:[]},fromYear:2026,toYear:2036});
assert.equal(rows.length,11);
assert.equal(rows[0].year,2026);
assert.equal(rows.at(-1).year,2036);
assert.ok(rows.every(x=>x.score>=0&&x.score<=100));
assert.ok(rows.every(x=>x.major&&x.minor));
console.log('timeline smoke test passed');
