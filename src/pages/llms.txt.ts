import type { APIRoute } from "astro";

const getLlmsTxt = (siteURL: URL) => `# Time Reminder

> Time Reminder is a free web app that provides audible reminders at regular quarter-hour intervals, offering a lightweight alternative to typical alarms and timers.

Time Reminder runs in a modern web browser and requires JavaScript and audio support. Users can choose reminders at the top of the hour (:00), quarter past (:15), half past (:30), or quarter to the hour (:45). They can also adjust the volume, set an optional time to stop reminders, and keep their reminder preferences between visits using local storage. No account or installation is required.

## Product

- [Time Reminder](${siteURL.href}): Use the live web app.
- [Time Reminder source code](https://github.com/devjusty/time-reminder): Read the open-source implementation and project documentation.

## Live Content
- [About](${new URL("/about", siteURL).href}): Learn more about Time Reminder.
- [Privacy Policy](${new URL("/privacy", siteURL).href}): Read the privacy policy for Time Reminder.
- [Terms of Service](${new URL("/terms", siteURL).href}): Read the terms of service for Time Reminder.
- [Contact](${new URL("/contact", siteURL).href}): Get in touch with the Time Reminder team.

## Related tools

- [Bed Time Calculator](https://sleep.timeremind.info): Calculate a suggested bedtime or wake-up time.
- [Tea Timer](https://tea.timeremind.info): Set a simple tea timer.
`;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("Astro site URL is required to build llms.txt");
  }

  return new Response(getLlmsTxt(site), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
