import "@testing-library/jest-dom/vitest";

// FAKE_NOW=2026-12-31T23:30:00 npm test  → pins Date.now() so date-sensitive
// tests can be exercised at month/year boundaries and weekends in CI.
if (process.env.FAKE_NOW) {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(process.env.FAKE_NOW));
}
