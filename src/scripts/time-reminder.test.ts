import { beforeEach, describe, expect, it, vi } from "vitest";

const toast = {
  config: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
};

class MockAudio {
  currentTime = 0;
  paused = true;
  volume = 1;

  play(): Promise<void> {
    return Promise.resolve();
  }
}

vi.mock("sonner-js", () => ({ default: toast }));
vi.mock("../assets/sounds/chime1.mp3", () => ({ default: "alarm.mp3" }));
vi.mock("../assets/sounds/double-chime.mp3", () => ({ default: "end.mp3" }));

function renderHomepage(): void {
  document.body.innerHTML = `
    <span id="digital-clock"></span>
    <div class="clock">
      <div class="notch zero"></div>
      <div class="notch fifteen"></div>
      <div class="notch thirty"></div>
      <div class="notch fortyfive"></div>
      <div class="needle hour"></div>
      <div class="needle minute"></div>
      <div class="needle second"></div>
    </div>
    <p id="audio-error"></p>
    <p id="schedule-status"></p>
    <button id="alarm1"></button>
    <button id="alarm2"></button>
    <button id="alarm3"></button>
    <button id="alarm4"></button>
    <input id="remind-until" />
    <input id="remind-until-toggle" type="checkbox" />
    <input id="volume" type="range" min="0" max="100" value="50" />
    <output id="volume-value"></output>
  `;
}

describe("persistent reminder runtime", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.stubGlobal("Audio", MockAudio);
    toast.config.mockClear();
    toast.success.mockClear();
    toast.error.mockClear();
    toast.info.mockClear();
    renderHomepage();
  });

  it("starts one interval and refreshes clock on each page load", async () => {
    const setIntervalSpy = vi.spyOn(window, "setInterval");
    await import("./time-reminder");

    document.dispatchEvent(new Event("DOMContentLoaded"));
    const initialTime = document.getElementById("digital-clock")?.textContent;
    document.body.innerHTML = "<main><h1>About</h1></main>";
    document.dispatchEvent(new Event("astro:page-load"));
    renderHomepage();
    document.dispatchEvent(new Event("astro:page-load"));

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(initialTime).toMatch(/\d{2}:\d{2} (AM|PM)/);
    expect(document.getElementById("digital-clock")?.textContent).toMatch(
      /\d{2}:\d{2} (AM|PM)/,
    );
  });

  it("does not require homepage elements off-homepage", async () => {
    document.body.innerHTML = "<main><h1>About</h1></main>";
    await import("./time-reminder");

    expect(() =>
      document.dispatchEvent(new Event("astro:page-load")),
    ).not.toThrow();
  });
});
