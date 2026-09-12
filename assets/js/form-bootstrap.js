/* Janma Kundali form safety net.
 * Runs before the larger astrology module so native form controls are usable
 * even if the main module is delayed by network/cache/WASM startup.
 */
(() => {
  const $ = id => document.getElementById(id);
  const adMonths = ['जनवरी','फेब्रुअरी','मार्च','अप्रिल','मे','जुन','जुलाई','अगस्ट','सेप्टेम्बर','अक्टोबर','नोभेम्बर','डिसेम्बर'];
  const bsMonths = ['बैशाख','जेठ','असार','श्रावण','भाद्र','आश्विन','कार्तिक','मंसिर','पौष','माघ','फाल्गुण','चैत्र'];

  function option(select, text, value) {
    const o = document.createElement('option');
    o.textContent = text;
    o.value = String(value);
    select.appendChild(o);
  }

  function daysInAdMonth(year, month) {
    return new Date(Date.UTC(Number(year), Number(month), 0)).getUTCDate();
  }

  function fillAdDays(preserve = true) {
    const year = $('year'), month = $('month'), day = $('day');
    if (!year || !month || !day || !year.value || !month.value) return;
    const old = preserve ? Number(day.value) || 18 : 18;
    day.replaceChildren();
    const max = daysInAdMonth(year.value, month.value);
    for (let i = 1; i <= max; i++) option(day, i, i);
    day.value = String(Math.min(old, max));
  }

  function fillBsDays(preserve = true) {
    const year = $('bsYear'), month = $('bsMonth'), day = $('bsDay');
    if (!year || !month || !day || !year.value || !month.value) return;
    const old = preserve ? Number(day.value) || 1 : 1;
    day.replaceChildren();
    // Safe UI range; the authoritative BS calendar module validates the final date.
    const max = 32;
    for (let i = 1; i <= max; i++) option(day, i, i);
    day.value = String(Math.min(old, max));
  }

  function ensureOptions() {
    const year = $('year'), month = $('month'), day = $('day');
    const bsYear = $('bsYear'), bsMonth = $('bsMonth'), bsDay = $('bsDay');
    if (!year || !month || !day || !bsYear || !bsMonth || !bsDay) return false;

    if (!year.options.length) {
      for (let y = 1900; y <= 2100; y++) option(year, y, y);
      year.value = '2002';
    }
    if (!month.options.length) {
      adMonths.forEach((name, i) => option(month, `${i + 1} · ${name}`, i + 1));
      month.value = '3';
    }
    fillAdDays(false);

    if (!bsYear.options.length) {
      for (let y = 1970; y <= 2100; y++) option(bsYear, y, y);
      bsYear.value = '2083';
    }
    if (!bsMonth.options.length) {
      bsMonths.forEach((name, i) => option(bsMonth, `${i + 1} · ${name}`, i + 1));
      bsMonth.value = '12';
    }
    fillBsDays(false);
    return true;
  }

  function setMode(mode) {
    const isBs = mode === 'BS';
    $('adMode')?.classList.toggle('active', !isBs);
    $('bsMode')?.classList.toggle('active', isBs);
    $('adDateFields')?.classList.toggle('hidden', isBs);
    $('bsDateFields')?.classList.toggle('hidden', !isBs);
    $('adMode')?.setAttribute('aria-pressed', String(!isBs));
    $('bsMode')?.setAttribute('aria-pressed', String(isBs));
    document.documentElement.dataset.calendar = mode;
    try { localStorage.setItem('jk-calendar-mode', mode); } catch (_) {}
  }

  function wire() {
    if (!ensureOptions()) return;
    $('year')?.addEventListener('change', () => fillAdDays(true));
    $('month')?.addEventListener('change', () => fillAdDays(true));
    $('bsYear')?.addEventListener('change', () => fillBsDays(true));
    $('bsMonth')?.addEventListener('change', () => fillBsDays(true));

    $('adMode')?.addEventListener('click', () => setMode('AD'));
    $('bsMode')?.addEventListener('click', () => setMode('BS'));

    const time = $('time');
    if (time && !time.value) time.value = '12:00';

    let saved = 'AD';
    try { saved = localStorage.getItem('jk-calendar-mode') || 'AD'; } catch (_) {}
    setMode(saved === 'BS' ? 'BS' : 'AD');
    document.body?.setAttribute('data-form-bootstrap', 'ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire, { once: true });
  } else {
    wire();
  }
})();
