import { motion } from "framer-motion";

const AnimatedClock = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="clock"
  >
    {/* Clock content */}
  </motion.div>
);
