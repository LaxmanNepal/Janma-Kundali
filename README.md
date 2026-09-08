# Janma Kundali

A Nepali-first Vedic birth-chart web application by Laxman Nepal.

## Implemented

- Nepali-first responsive UI
- Birth name, AD date, local time and birthplace input
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
- Printable report
- Light/dark mode
- Mobile-first responsive report UI
- Built-in coordinates for major Nepal cities
- Vite build pipeline
- GitHub Pages deployment workflow
- PWA manifest foundation

## Accuracy and scope

This release replaces the old deterministic placeholder with a real ephemeris-based browser calculation engine. The project uses `@swisseph/browser`, which provides Swiss Ephemeris calculations through WebAssembly and exposes sidereal calculations including Lahiri mode and house calculations.

The current location resolver contains a small Nepal city dataset. If a user enters an unsupported location, the engine deliberately marks the result as approximate and falls back to Kathmandu coordinates. This is not suitable for claiming exact worldwide birthplace support yet.

The application should be treated as an astrology calculation/education tool, not as medical, financial, legal or scientific advice.

## Architecture

```text
Static web / PWA
      |
      +--> Vite application
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
              |
              +--> Report UI
                     +--> D1 chart
                     +--> planet table
                     +--> timeline
                     +--> print
```

## Next production layers

1. Full BS ↔ AD conversion with validated Nepali calendar test vectors
2. Worldwide geocoder + IANA timezone database
3. Panchanga: Tithi, Vara, Yoga, Karana and sunrise/sunset
4. More Varga charts: D2, D3, D7, D10, D12, D16, D20, D24, D27, D30, D40, D45 and D60
5. Gochar/transit engine
6. Sade Sati and planetary transit reports
7. Manglik, Kaal Sarp and other rule-based reports
8. Ashtakoota / Guna Milan matching
9. Muhurta
10. PDF report generator with shareable report IDs
11. Saved profiles and authentication
12. SEO landing pages for Rashi/Nakshatra/astrology topics
13. API layer for Android/mobile clients
14. Admin/editor tools and content management
15. Automated calculation regression tests against trusted reference charts

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
