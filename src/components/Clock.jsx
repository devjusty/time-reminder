/* eslint-disable-next-line no-unused-vars */
import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { getTimeComponents } from "../utils/getTime";
import { useAlarmChecker } from "../hooks/useAlarmChecker";
import { useSettings } from "../hooks/useSettings";

const Clock = () => {
    const [isMounted, setIsMounted] = useState(false);

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    /* eslint-disable-next-line no-unused-vars */
    const [seconds, setSeconds] = useState(0);

    // Alarm checking hook
    const { checkAlarms, resetTriggerOnMinuteChange, isAlarmActive } =
        useAlarmChecker();
    
    // Settings hook for hour format
    const { settings } = useSettings();

    // Initialize motion values for smooth rotation
    const hourRotation = useMotionValue(0);
    const minuteRotation = useMotionValue(0);
    const secondRotation = useMotionValue(0);

    // Utility function for scaling values (ported from old script)
    const scale = (num, in_min, in_max, out_min, out_max) =>
        ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;

    // Helper function to add leading zeroes (ported from old script)
    const addZero = (time) => {
        return time < 10 ? `0${time}` : time.toString();
    };

    // Format time based on settings (only zero-pad minutes, not hours)
    const formatTime = (hours, minutes) => {
        if (settings.hourFormat === '24h') {
            return `${hours}:${addZero(minutes)}`;
        } else {
            // 12-hour format
            let displayHour = hours;
            const am_pm = hours < 12 ? 'AM' : 'PM';
            
            if (displayHour > 12) displayHour -= 12;
            if (displayHour === 0) displayHour = 12;
            
            return `${displayHour}:${addZero(minutes)} ${am_pm}`;
        }
    };

    // Update time every second
    useEffect(() => {
        setIsMounted(true);
        const interval = setInterval(() => {
            const now = new Date();
            const { hours, minutes, seconds } = getTimeComponents(now);
            setHours(hours);
            setMinutes(minutes);
            setSeconds(seconds);

            // Check for alarms and reset trigger state
            checkAlarms(now);
            resetTriggerOnMinuteChange(now);

            // Calculate rotations using the same approach as old script
            const hourAngle = scale(hours % 12, 0, 12, 0, 360);
            const minuteAngle = scale(minutes, 0, 60, 0, 360);
            const secondAngle = scale(seconds, 0, 60, 0, 360);

            // Update rotations with minimal smooth transitions
            // Only animate if the change is small (< 180 degrees) to avoid the loop issue
            const animateIfSmallChange = (motionValue, targetAngle, duration = 0.3) => {
                const currentAngle = motionValue.get();
                const diff = Math.abs(targetAngle - currentAngle);
                
                if (diff > 180) {
                    // Large jump - set directly without animation
                    motionValue.set(targetAngle);
                } else {
                    // Small change - animate smoothly
                    animate(motionValue, targetAngle, {
                        duration,
                        ease: 'easeOut',
                    });
                }
            };

            animateIfSmallChange(hourRotation, hourAngle, 0.5);
            animateIfSmallChange(minuteRotation, minuteAngle, 0.3);
            animateIfSmallChange(secondRotation, secondAngle, 0.1);
        }, 1000);

        return () => clearInterval(interval);
    }, [
        hourRotation,
        minuteRotation,
        secondRotation,
        checkAlarms,
        resetTriggerOnMinuteChange,
    ]);

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
                className={`clock w-[200px] h-[200px] rounded-full border-2 border-white relative transition-all duration-300 ${isAlarmActive ? 'ring-4 ring-red-500 ring-opacity-75 shadow-lg shadow-red-500/50' : ''}`}
            >
                {/* Hour Hand */}
                <motion.div
                    className="needle hour absolute top-1/2 left-1/2 w-1 h-16 bg-white rounded-full origin-bottom -translate-x-1/2 -translate-y-full"
                    style={{
                        rotate: hourRotation,
                    }}
                />

                {/* Minute Hand */}
                <motion.div
                    className="needle minute absolute top-1/2 left-1/2 w-1 h-24 bg-blue-400 rounded-full origin-bottom -translate-x-1/2 -translate-y-full"
                    style={{
                        rotate: minuteRotation,
                    }}
                />

                {/* Second Hand */}
                <motion.div
                    className="needle second absolute top-1/2 left-1/2 w-0.5 h-28 bg-red-500 rounded-full origin-bottom -translate-x-1/2 -translate-y-full"
                    style={{
                        rotate: secondRotation,
                    }}
                />

                {/* Active Reminders Notch */}
                <motion.div
                    className="notch absolute top-1/2 left-1/2 w-1 h-16 bg-white rounded-full origin-bottom -translate-x-1/2 -translate-y-full"
                    style={{
                        rotate: hourRotation,
                    }}
                />

                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 z-10" />
            </div>
            <div className="time text-2xl my-2 text-center text-white">
                {formatTime(hours, minutes)}
            </div>
        </motion.div>
    );
};

export default Clock;
