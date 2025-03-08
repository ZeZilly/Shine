import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}

export function ScrollReveal({ 
  children, 
  direction = "up",
  delay = 0 
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directionOffset = {
    up: { y: 50 },
    down: { y: -50 },
    left: { x: 50 },
    right: { x: -50 }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0,
        ...directionOffset[direction]
      }}
      animate={{
        opacity: isInView ? 1 : 0,
        x: isInView ? 0 : directionOffset[direction].x,
        y: isInView ? 0 : directionOffset[direction].y
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeOut"
      }}
      style={{position: 'relative'}} // Added relative positioning to fix scroll offset
    >
      {children}
    </motion.div>
  );
}