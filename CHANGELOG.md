# Changelog

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
