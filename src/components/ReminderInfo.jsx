import { useClock } from '../hooks/useClock';
import { useRemindUntil } from '../hooks/useRemindUntil';

const ReminderInfo = () => {
    const {
        reminderInfo,
        minutes,
    } = useClock();
    const {
        remindUntil,
    } = useRemindUntil();


    return (
        <div className="reminder-info flex gap-4 text-center text-sm">
            <div className="flex flex-col gap-2">
                {/* Active Reminders */}
                <span className="text-primary opacity-70">
                    Active Reminders:
                </span>
                <div className="flex items-center justify-center gap-2">
                    <div className="flex gap-1">
                        {reminderInfo.enabledTimes.length > 0 ? (
                            reminderInfo.enabledTimes.map((time) => (
                                <span
                                    key={time}
                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                        reminderInfo.isCurrentlyActive &&
                                        time ===
                                            String(minutes).padStart(2, '0')
                                            ? 'bg-accent text-white'
                                            : 'bg-secondary text-primary'
                                    }`}
                                >
                                    &#x2236;{time}
                                </span>
                            ))
                        ) : (
                            <span className="text-primary opacity-50 text-xs">
                                None
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Next Reminder */}
            <div className="flex flex-col gap-2">
                <span className="text-primary opacity-70">Next Reminder:</span>
                <div className="flex items-center justify-center gap-2">
                    {reminderInfo.nextReminder ? (
                        <span className="px-2 py-1 bg-accent text-accent-content rounded text-xs font-medium">
                            {reminderInfo.nextReminder.formatted}
                            {!reminderInfo.nextReminder.isToday && (
                                <span className="ml-1 opacity-75">
                                    (tomorrow)
                                </span>
                            )}
                        </span>
                    ) : (
                        <span className="text-primary opacity-50 text-xs">
                            None scheduled
                        </span>
                    )}
                </div>
            </div>

            {/* Remind Until */}
            {remindUntil.enabled && (
            <div className="flex flex-col gap-2">
                <span className="text-primary opacity-70">Remind Until:</span>
                <div className="flex items-center justify-center gap-2">
                    {remindUntil.time ? (
                        <span className="px-2 py-1 bg-accent text-accent-content rounded text-xs font-medium">
                            {remindUntil.time}
                            {!remindUntil.isToday && (
                                <span className="ml-1 opacity-75">
                                    (tomorrow)
                                </span>
                            )}
                        </span>
                    ) : (
                        <span className="text-primary opacity-50 text-xs">
                            None scheduled
                        </span>
                    )}
                </div>
            </div>
            )}
        </div>
    );
};

export default ReminderInfo;
