# Janma Kundali

A Nepali-first Vedic birth-chart web application by Laxman Nepal.

## Implemented

- Nepali-first responsive UI
- BS and AD birth-date selector
- BS ↔ AD conversion using `nepali-calendar-panchang` 1.0.2
- Browser-side Swiss Ephemeris WebAssembly engine
- Lahiri sidereal mode
- Whole-sign house system
- Moon Rashi, Nakshatra and Pada
- Ascendant / Lagna
- Sun, Moon, Mars, Mercury, Jupiter, Venus and Saturn positions
- Rahu / Ketu node positions
- Degree and sign display
- Retrograde state from the calculation engine
- Vimshottari Dasha timeline
- D9 Navamsa sign calculation
- Birth-time Panchanga foundation
- Printable report
- Light/dark mode
- Mobile-first responsive report UI
- Location database with IANA timezone identifiers
- Vite build pipeline
- GitHub Pages deployment workflow
- PWA/offline cache foundation

## Date conversion

The birth form can switch between AD and BS. BS dates are validated against the supported calendar range (BS 1970–2100), then converted to an AD civil date before astronomical calculations. This keeps the Swiss Ephemeris layer Gregorian internally while giving Nepali users a native Bikram Sambat input experience.

The conversion package exposes `adToBs`, `bsToAd`, `daysInMonth`, and the supported range without requiring a runtime conversion API. Its documentation also describes BS/AD conversion and browser-compatible date utilities.

## Accuracy and scope

This release uses a real ephemeris-based browser calculation engine. The location resolver loads the repository's curated city database and uses IANA timezone names for local-time conversion. Unsupported places are deliberately marked approximate and fall back to Kathmandu coordinates.

Panchanga is currently a birth-time foundation rather than a complete daily almanac. Varga charts beyond D9, transit reports, matching rules and advanced Jyotish interpretations remain separate production layers.

The application should be treated as an astrology calculation/education tool, not as medical, financial, legal or scientific advice.

## Architecture

```text
Static web / PWA
      |
      +--> Vite application
              |
              +--> BS/AD calendar layer
              |      +--> Bikram Sambat input
              |      +--> AD conversion
              |
              +--> Swiss Ephemeris WASM
              |      +--> planetary longitude
              |      +--> Lahiri sidereal zodiac
              |      +--> houses / ascendant
              |
              +--> Astrology domain layer
              |      +--> Rashi
              |      +--> Nakshatra / Pada
              |      +--> Dasha
              |      +--> D9 Navamsa
              |      +--> Panchanga foundation
              |
              +--> Report UI
                     +--> D1 chart
                     +--> planet table
                     +--> Panchanga
                     +--> timeline
                     +--> print
```

## Next production layers

1. Full Varga charts: D2, D3, D7, D10, D12, D16, D20, D24, D27, D30, D40, D45 and D60
2. Gochar/transit engine
3. Sade Sati and planetary transit reports
4. Manglik, Kaal Sarp and other rule-based reports
5. Ashtakoota / Guna Milan matching
6. Muhurta
7. PDF report generator with shareable report IDs
8. Saved profiles and authentication
9. SEO landing pages for Rashi/Nakshatra/astrology topics
10. API layer for Android/mobile clients
11. Admin/editor tools and content management
12. Automated calculation regression tests against trusted reference charts

## Development

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Deployment

GitHub Actions builds the Vite application and deploys `dist/` to GitHub Pages on pushes to `main`. The Vite base path is relative so the same build can also be hosted under a subdirectory or custom domain.

## License / ephemeris note

Review the licensing and distribution requirements of Swiss Ephemeris before adding Swiss ephemeris data files or commercializing the service. The current browser package uses its documented built-in Moshier ephemeris path by default.
