# Calculation modules

The `src/` directory contains calculation layers that can be consumed by the browser UI or a future API.

- `panchanga.js` calculates Vara, Tithi, Paksha and Yoga from ephemeris longitudes.
- `assets/js/astrology.js` handles the main birth-chart calculation.

Future modules should add Karana, sunrise/sunset, Gochar, Varga charts, Ashtakoota matching and Muhurta using the same calculation primitives.
