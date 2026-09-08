# Janma Kundali

A Nepali-first Vedic birth-chart web application by Laxman Nepal.

## Implemented platform

- Nepali-first responsive UI
- BS and AD birth-date selector with validation
- BS ↔ AD conversion using `nepali-calendar-panchang` 1.0.2
- Browser-side Swiss Ephemeris WebAssembly engine
- Lahiri sidereal mode and Whole Sign houses
- Moon Rashi, Nakshatra and Pada
- Ascendant / Lagna
- Sun, Moon, Mars, Mercury, Jupiter, Venus and Saturn positions
- Rahu / Ketu node positions
- Degree, sign and retrograde state
- Vimshottari Dasha timeline
- D9 Navamsa
- D1–D60 divisional/Varga engine
- Birth-time Panchanga foundation
- Current sidereal Gochar dashboard
- Saturn Sade Sati and Dhaiya detection
- Ashtakoota / Guna Milan: Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot and Nadi
- Manglik comparison from Lagna, Moon and Venus
- Printable report
- Light/dark mode
- Mobile-first responsive UI
- Curated Nepal/Kuwait location database with IANA timezones
- PWA offline cache with application modules and data
- Vite build pipeline and GitHub Pages deployment workflow
- Matching engine smoke test

## Architecture

```text
Static Web / PWA
  ├─ BS/AD calendar layer
  ├─ Swiss Ephemeris WASM
  │   ├─ Lahiri sidereal zodiac
  │   ├─ planetary longitude + speed
  │   └─ Whole Sign ascendant/houses
  ├─ Jyotish domain layer
  │   ├─ Rashi / Nakshatra / Pada
  │   ├─ Vimshottari Dasha
  │   ├─ D1–D60 Varga
  │   ├─ Panchanga
  │   ├─ Gochar / Sade Sati
  │   └─ Ashtakoota / Manglik matching
  └─ Report UI
      ├─ D1 chart + planet table
      ├─ Panchanga + Dasha + D9
      ├─ Varga tabs
      ├─ Gochar dashboard
      └─ Matching report
```

## Accuracy and scope

The astronomical layer is ephemeris-based and runs in the browser. Curated locations use IANA timezone identifiers; unsupported places are marked approximate and fall back to Kathmandu coordinates. Divisional-chart and matching conventions can vary between Jyotish traditions, so the application labels these rules rather than presenting them as universal facts.

Panchanga in the current release is a birth-time foundation, not a full daily almanac with sunrise/sunset and festival calendars. Matching is a traditional astrology calculation and is not a scientific compatibility test or a guaranteed prediction.

## Date conversion

BS dates are validated against the supported calendar range (BS 1970–2100) and converted to an AD civil date before astronomical calculations. This keeps the ephemeris layer Gregorian internally while giving Nepali users a native Bikram Sambat input experience.

## Development

```bash
npm install
npm run dev
npm run build
npm test
npm run preview
```

## Deployment

GitHub Actions builds the Vite application and deploys `dist/` to GitHub Pages on pushes to `main`. The app is also structured so the generated static site can be hosted on a custom domain or subdirectory.

## Future production extensions

The core calculation platform is now in place. Remaining optional production extensions are a complete daily Panchanga/Muhurta calendar, richer rule-based interpretations, report persistence/authentication, server-side shareable report IDs, mobile API endpoints, editorial CMS, and a larger regression corpus of reference charts.

## License / ephemeris note

Review the licensing and distribution requirements of Swiss Ephemeris before adding Swiss ephemeris data files or commercializing the service. The current browser package uses its documented built-in Moshier ephemeris path by default.
