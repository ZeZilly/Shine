import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Renders an image with a parallax scrolling effect.
 *
 * As the user scrolls, the image shifts vertically from 0% to 30% of its container, creating a smooth parallax animation.
 * The effect is achieved by mapping the scroll progress of the container element to a vertical transform applied to the image.
 *
 * @param src - The URL of the image.
 * @param alt - The alternative text for the image, providing accessibility.
 * @param className - Optional additional CSS classes for the container element.
 */
export function ParallaxImage({ src, alt, className }: ParallaxImageProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
