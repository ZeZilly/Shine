import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}

/**
 * Animates its children into view when they become visible in the viewport.
 *
 * This component uses the framer-motion library to apply a fade-in and directional translation effect
 * as its content scrolls into view. The animation triggers only once when the element is within a -100px margin,
 * with the initial offset determined by the specified direction.
 *
 * @param children - The React nodes to animate.
 * @param direction - The direction from which the content animates. Accepted values are "up", "down", "left", or "right". Defaults to "up".
 * @param delay - The delay, in seconds, before the animation starts. Defaults to 0.
 *
 * @example
 * <ScrollReveal direction="left" delay={0.5}>
 *   <div>Animated Content</div>
 * </ScrollReveal>
 */
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