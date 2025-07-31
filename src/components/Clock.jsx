// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { useClock } from "../hooks/useClock";

const Clock = () => {
    const {
        formattedTime,
        hourRotation,
        minuteRotation,
        secondRotation,
        isMounted,
        isAlarmActive,
        reminderInfo,
        minutes,
        scale
    } = useClock();

    // Only render the clock after mounting to avoid hydration mismatch
    if (!isMounted) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="clock-container"
        >
            <div
                className={`clock w-[200px] h-[200px] rounded-full border-2 border-secondary relative transition-all duration-300 ${isAlarmActive ? 'ring-4 ring-red-500 ring-opacity-75 shadow-lg shadow-red-500/50' : ''}`}
            >
                {/* Hour Hand */}
                <motion.div
                    className="needle hour absolute top-1/2 left-1/2 w-1 h-16 bg-accent rounded-full origin-bottom -translate-x-1/2 -translate-y-full"
                    style={{
                        rotate: hourRotation,
                    }}
                />

                {/* Minute Hand */}
                <motion.div
                    className="needle minute absolute top-1/2 left-1/2 w-1 h-22 bg-primary rounded-full origin-bottom -translate-x-1/2 -translate-y-full"
                    style={{
                        rotate: minuteRotation,
                    }}
                />

                {/* Second Hand */}
                <motion.div
                    className="needle second absolute top-1/2 left-1/2 w-0.5 h-24 bg-info rounded-full origin-bottom -translate-x-1/2 -translate-y-full"
                    style={{
                        rotate: secondRotation,
                    }}
                />

                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 z-10" />

                {/* Active Reminders Notches */}
                {reminderInfo.enabledTimes.map((time) => (
                    <motion.div
                        key={time}
                        className="notch absolute top-1/2 left-1/2 w-0 h-26 bg-transparent border-l-[6px] border-r-[6px] border-t-[14px] border-l-transparent border-r-transparent border-t-primary origin-bottom -translate-x-1/2 -translate-y-full"
                        style={{
                            rotate: scale(parseInt(time), 0, 60, 0, 360),
                        }}
                    />
                ))}
            </div>

            {/* Current Time Display */}
            <div className="time text-2xl my-2 text-center text-primary font-bold">
                {formattedTime}
            </div>

            {/* Reminder Information */}
            <div className="reminder-info flex gap-4 text-center text-sm">
                <div className="flex flex-col">
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
                                    :{time}
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
                <div className="flex flex-col">
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
            </div>
        </motion.div>
    );
};

export default Clock;
