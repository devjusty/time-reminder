export type ReminderDecision = {
  triggered: boolean;
  nextLastTriggeredMinute: string | null;
};

export function evaluateReminder(
  minute: number,
  currentTimeKey: string,
  lastTriggeredMinute: string | null,
  alarms: Record<string, boolean>,
  intervals: readonly string[],
): ReminderDecision {
  if (lastTriggeredMinute === currentTimeKey) {
    return {
      triggered: false,
      nextLastTriggeredMinute: lastTriggeredMinute,
    };
  }

  const currentMinute = minute.toString().padStart(2, "0");
  const triggered = intervals.some(
    (interval, index) =>
      alarms[`alarm${index + 1}`] && currentMinute === interval,
  );

  return {
    triggered,
    nextLastTriggeredMinute: triggered ? currentTimeKey : lastTriggeredMinute,
  };
}
