import { renderKundaliChart } from './chart-renderer.js';
import assert from 'node:assert/strict';
const data={ascendant:{sign:3},planets:[{name:'सूर्य',sign:3,signName:'कर्कट',degree:10,retrograde:false},{name:'चन्द्र',sign:7,signName:'वृश्चिक',degree:12,retrograde:false},{name:'राहु',sign:10,signName:'कुम्भ',degree:2,retrograde:true},{name:'केतु',sign:4,signName:'सिंह',degree:2,retrograde:true}]};
const host={innerHTML:''};
renderKundaliChart(host,data,'north');assert.match(host.innerHTML,/North Indian/);assert.match(host.innerHTML,/सू/);assert.match(host.innerHTML,/रा℞/);
renderKundaliChart(host,data,'south');assert.match(host.innerHTML,/South Indian/);assert.match(host.innerHTML,/लग्न/);
console.log('chart renderer smoke test passed');
