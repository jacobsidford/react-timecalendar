# Changelog

## 3.1.0 — 2026-09-18

### Added
- Controlled `selectedDate` / `onSelectedDateChange` and `view` / `onViewChange` props, with `defaultSelectedDate` / `defaultView` for uncontrolled initial state. Existing uncontrolled usage is unchanged.
- `CalendarView` type export.
- "Complete booking flow" example in the README and an `llms.txt` for agent crawlers.

### Fixed
- Opening hours are now wall-clock times. On DST transition days `addHours(startOfDay, 9)` rendered the 09:00 slot as 10:00 (or 08:00).
- `view="day"` without `openHours` falls back to month view for navigation too; previously prev/next stepped by day behind a month grid and Previous could lock up under `disableHistory`.
- Dropping a controlled `selectedDate` or `view` prop keeps the last value instead of snapping back to the initial default.

## 3.0.1 — 2026-09-18

### Fixed
- ESM build is now `build/index.mjs`. With a `.js` extension in a CommonJS package, native Node ESM (SSR, vitest in node mode) treated it as CJS and named imports failed.

## 3.0.0 — 2026-09-18

### Breaking
- date-fns v1 → v4, no longer bundled. Install `date-fns` alongside.
- String dates in `bookings`, `startTime`, `endTime` must be ISO-8601.

### Added
- Named export `TimeCalendar` alongside the default export.
- `exports` map with `types`, `import` and `require` entries; `sideEffects: false`.
- MIT `LICENSE` file.

### Changed
- Package size ~380 KB → ~14 KB (tarball).

## 2.2.0 — 2026-09-18

### Fixed
- Repo was unbuildable (node-sass native compile). Replaced with dart sass and `@rollup/plugin-typescript`.
- Crash when `bookings` was omitted.
- `prop-types` imported without being a dependency; `defaultProps` on a function component (removed in React 19).
- README defaults (`disableHistory`, `clickable`, `timeSlot`) were never implemented.
- `onDateClick` prop now works as documented; `onDateFunction` kept as deprecated alias.
- Tab key no longer selects cells; only Enter and Space activate.
- `openHours` with an unsupported length renders "Closed" instead of nothing.

### Added
- Vite demo with GitHub Pages deploy, GitHub Actions CI, vitest suite.
- Type declarations shipped (`types` field); React peer range widened to `>=16.8`.
