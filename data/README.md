# Location data

`locations.json` contains curated city coordinates and IANA timezone IDs used by the static Kundali application.

The production architecture should eventually replace the curated list with a larger searchable gazetteer and preserve the exact latitude, longitude, and historical timezone for the birth date.

Do not infer historical timezone rules from a fixed UTC offset when calculating old birth records.
