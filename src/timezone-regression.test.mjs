import assert from 'node:assert/strict';
import { localToUtc as astrologyUtc } from '../assets/js/astrology.js';
import { localToUtc as panchangaUtc } from './panchanga.js';
import { localToUtc as gocharUtc } from './gochar.js';

const cases=[
  ['Asia/Kathmandu','2026-01-01','12:00','2026-01-01T06:15:00.000Z'],
  ['Asia/Kolkata','2026-01-01','12:00','2026-01-01T06:30:00.000Z'],
  ['Asia/Dubai','2026-01-01','12:00','2026-01-01T08:00:00.000Z'],
  ['Asia/Kathmandu','2026-06-15','05:30','2026-06-14T23:45:00.000Z']
];
for(const [tz,date,time,expected] of cases){
  assert.equal(astrologyUtc(date,time,tz).toISOString(),expected,`astrology ${tz}`);
  assert.equal(panchangaUtc(date,time,tz).toISOString(),expected,`panchanga ${tz}`);
  assert.equal(gocharUtc(date,time,tz).toISOString(),expected,`gochar ${tz}`);
}
console.log('timezone regression test passed');
