import { describe, expect, it } from "vitest";
import { calculateDashboardStats, countEntriesByType } from "../features/entries/calculations";
import { parseCreateEntryForm } from "../features/entries/validation";
import type { EntryView } from "../features/entries/types";

const entries: EntryView[] = [
  { id: "1", date: "2026-06-01", type: "push", text: "卧推 60kg 8 8 8" },
  { id: "2", date: "2026-06-02", type: "pull", text: "引体 8 8 7" },
  { id: "3", date: "2026-06-04", type: "push", text: "卧推 65kg 6 6 6" }
];

describe("entry calculations", () => {
  it("calculates dashboard metrics from server entries", () => {
    expect(calculateDashboardStats(entries, "2026-06")).toEqual({
      totalDays: 3,
      monthDays: 3,
      bestStreak: 2,
      benchMax: 65
    });
  });

  it("counts entries by type", () => {
    expect(countEntriesByType(entries)).toEqual({
      push: 2,
      pull: 1,
      legs: 0,
      mixed: 0
    });
  });
});

describe("entry validation", () => {
  it("parses valid create form input", () => {
    const formData = new FormData();
    formData.set("date", "2026-06-24");
    formData.set("type", "mixed");
    formData.set("text", "卷腹 20x3");

    expect(parseCreateEntryForm(formData)).toEqual({
      date: "2026-06-24",
      type: "mixed",
      text: "卷腹 20x3"
    });
  });

  it("rejects invalid type input", () => {
    const formData = new FormData();
    formData.set("date", "2026-06-24");
    formData.set("type", "admin");
    formData.set("text", "非法类型");

    expect(() => parseCreateEntryForm(formData)).toThrow();
  });
});
