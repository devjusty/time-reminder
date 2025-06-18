/* eslint-disable-next-line no-unused-vars */
import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { getTimeComponents } from "../utils/getTime";

const Clock = () => {
  const [isMounted, setIsMounted] = useState(false);

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Initialize motion values for smooth rotation
  const hourRotation = useMotionValue(0);
  const minuteRotation = useMotionValue(0);
  const secondRotation = useMotionValue(0);

  // Update time every second
  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      const now = new Date();
      const { hours, minutes, seconds } = getTimeComponents(now);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
      
      // Calculate rotations
      const hourAngle = (hours % 12) * 30 + (minutes / 60) * 30;
      const minuteAngle = minutes * 6 + (seconds / 60) * 6; // Smooth minute hand movement
      const secondAngle = seconds * 6;
      
      // Update rotations with smooth transitions
      animate(hourRotation, hourAngle, {
        duration: 0.8,
        ease: "easeInOut"
      });
      
      animate(minuteRotation, minuteAngle, {
        duration: 0.8,
        ease: "easeInOut"
      });
      
      // Second hand moves with a tween animation for smooth continuous motion
      // We use a tween instead of spring to avoid the snap-back effect
      animate(secondRotation, secondAngle, {
        duration: 0.9, // Slightly longer duration for smoother motion
        ease: [0.4, 0, 0.2, 1], // Custom ease for more natural movement
        // Use type: 'tween' explicitly to prevent spring behavior
        type: 'tween'
      });
      
    }, 1000);
    
    return () => clearInterval(interval);
  }, [hourRotation, minuteRotation, secondRotation]);

  // Only render the clock after mounting to avoid hydration mismatch
  if (!isMounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="clock-container"
    >
      <div className="clock w-[200px] h-[200px] rounded-full border-2 border-white relative">
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
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 z-10" />
      </div>
      <div className="time absolute top-1/2 left-1/2 text-white">{hours}:{minutes}</div>
    </motion.div>
  );
};

export default Clock;