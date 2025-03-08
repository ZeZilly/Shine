import { cn } from "@/lib/utils"

/**
 * Renders a skeleton loader as a styled div element.
 *
 * This component displays a pulsing placeholder with rounded corners and a muted background,
 * making it ideal for indicating content that is loading. Any additional CSS classes and HTML attributes
 * provided are merged with the default styling.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
