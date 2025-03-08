import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  placeholder?: string;
}

/**
 * Renders an image that initially displays a placeholder and transitions to the actual image with a fade-in effect.
 *
 * The component shows a placeholder image until the main image specified by the `src` prop is fully loaded. Once loaded, it updates to the actual image and applies a smooth opacity transition. It also supports lazy loading and custom styling via CSS classes.
 *
 * @param src - The URL of the main image.
 * @param alt - The alternative text for the image.
 * @param className - Additional CSS classes for custom styling.
 * @param width - The width of the image.
 * @param height - The height of the image.
 * @param loading - The loading behavior ("lazy" or "eager"). Defaults to "lazy".
 * @param placeholder - The placeholder image source displayed until the main image loads. Defaults to a blank SVG.
 *
 * @returns A React element rendering the optimized image.
 */
export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  loading = "lazy",
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={cn(
        "transition-opacity duration-300",
        isLoaded ? "opacity-100" : "opacity-30",
        className
      )}
      width={width}
      height={height}
      loading={loading}
    />
  );
} 