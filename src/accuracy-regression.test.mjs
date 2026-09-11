import assert from 'node:assert/strict';
import { buildVimshottari, navamsaSign, localToUtc, nakAt, signAt } from '../assets/js/astrology.js';

assert.equal(signAt(0),0);
assert.equal(signAt(359.999),11);
assert.equal(nakAt(0).name,'अश्विनी');
assert.equal(nakAt(0).pada,1);
assert.equal(nakAt(13.2).pada,4);

assert.equal(navamsaSign(0),'मेष');
assert.equal(navamsaSign(30),'मकर');
assert.equal(navamsaSign(60),'तुला');
assert.equal(navamsaSign(90),'कर्कट');

const birth=new Date('2000-01-01T00:00:00.000Z');
const dasha=buildVimshottari(0,birth);
assert.equal(dasha.birthLord,'केतु');
assert.equal(dasha.periods[0].years,7);
assert.equal(dasha.periods[0].start,'2000-01-01');
// दशा अवधि 365.2425-दिनको वर्षमा गणना हुन्छ; 7 वर्षको खगोलीय अवधि
// Gregorian calendar मा 2006-12-31 मा समाप्त हुन्छ, 2007-01-01 मा होइन।
assert.equal(dasha.periods[0].end,'2006-12-31');
assert.equal(dasha.periods.length,9);

assert.equal(localToUtc('2026-01-01','12:00','Asia/Kathmandu').toISOString(),'2026-01-01T06:15:00.000Z');
assert.equal(localToUtc('2026-01-01','12:00','Asia/Kolkata').toISOString(),'2026-01-01T06:30:00.000Z');
console.log('astrology accuracy regression test passed');
