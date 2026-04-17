import { describe, it, expect } from "vitest";
import { getCurrentMenuTheme } from "@/lib/voice/menu-theme";

describe("getCurrentMenuTheme", () => {
  it("returns a theme with season, theme, last_updated", () => {
    const t = getCurrentMenuTheme(new Date("2026-04-17"));
    expect(t.season).toBe("spring");
    expect(t.theme.length).toBeGreaterThan(10);
    expect(t.last_updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it("maps December to winter", () => {
    expect(getCurrentMenuTheme(new Date("2026-12-01")).season).toBe("winter");
  });
  it("maps July to summer", () => {
    expect(getCurrentMenuTheme(new Date("2026-07-15")).season).toBe("summer");
  });
  it("maps September to fall", () => {
    expect(getCurrentMenuTheme(new Date("2026-09-01")).season).toBe("fall");
  });
});
