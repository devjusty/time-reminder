import { describe, expect, it } from "vitest";
import { evaluateReminder } from "./reminder-logic";

describe("evaluateReminder", () => {
  it("triggers active alarm matching current minute", () => {
    expect(
      evaluateReminder(
        15,
        "2026-08-20-10:15",
        null,
        { alarm1: false, alarm2: true },
        ["00", "15"],
      ),
    ).toEqual({
      triggered: true,
      nextLastTriggeredMinute: "2026-08-20-10:15",
    });
  });

  it("does not trigger same minute twice", () => {
    expect(
      evaluateReminder(
        15,
        "2026-08-20-10:15",
        "2026-08-20-10:15",
        { alarm1: true },
        ["00", "15"],
      ),
    ).toEqual({
      triggered: false,
      nextLastTriggeredMinute: "2026-08-20-10:15",
    });
  });

  it("does not trigger when no alarm matches", () => {
    expect(
      evaluateReminder(14, "2026-08-20-10:14", null, { alarm1: true }, [
        "00",
        "15",
      ]),
    ).toEqual({
      triggered: false,
      nextLastTriggeredMinute: null,
    });
  });
});
