# Janma Kundali

A Nepali-first birth-chart web application by Laxman Nepal.

## Current phase

This repository now contains a responsive, mobile-first frontend foundation with:

- Nepali-first interface
- Birth name/date/time/place form
- Interactive demo Kundali report
- Rashi, Nakshatra, Lagna and element summary
- Planet-position report UI
- Printable report action
- Light/dark mode
- Responsive layout
- Zero-backend static deployment support

## Important accuracy note

The current browser demo uses a deterministic placeholder calculation so the UI can be tested without a backend. **It must not be presented as an astronomically accurate Kundali.** The next engineering phase should replace it with a real ephemeris-based sidereal calculation engine, timezone/location resolution, and validated test vectors.

## Planned architecture

```text
Browser / PWA
    ↓
Astrology API
    ↓
Calculation engine (ephemeris + sidereal zodiac + houses)
    ↓
Reports / Kundali / Dasha / Gochar / Matching
    ↓
Database + location dataset
```

## Roadmap

1. Real astronomical calculation engine
2. BS date conversion and Nepali calendar integration
3. Nepal + worldwide birthplace search
4. Rashi / Nakshatra / Pada / Lagna validation
5. Bhava and divisional charts (D1, D9 and more)
6. Vimshottari Dasha
7. Gochar and Sade Sati
8. Kundali matching / Guna Milan
9. PDF report generation
10. Saved profiles and shareable reports
11. PWA / offline shell
12. SEO pages and structured data
13. API and Android-ready endpoints

## Deployment

The app is static and can be deployed to GitHub Pages or Cloudflare Pages. No API key is required for the current demo UI.
