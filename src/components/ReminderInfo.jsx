import { useClock } from '../hooks/useClock';
import { useRemindUntil } from '../hooks/useRemindUntil';

const ReminderInfo = () => {
    const {
        reminderInfo,
    } = useClock();
    const {
        remindUntil,
    } = useRemindUntil();


    return (
        <div className="reminder-info flex gap-4 text-center text-sm">

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
                        <span className="px-2 py-1 text-primary opacity-50 text-xs">
                            None scheduled
                        </span>
                    )}
                </div>
            </div>

            {/* Remind Until */}
            {remindUntil.enabled && (
                <div className="flex flex-col gap-2">
                    <span className="text-primary opacity-70">
                        Stop At:
                    </span>
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
