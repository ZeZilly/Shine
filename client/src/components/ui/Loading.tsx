import { Loader2 } from "lucide-react";

/**
 * Renders a centered loading spinner.
 *
 * This component displays a spinning loader icon using `Loader2` from the "lucide-react" library.
 * It centers the icon both vertically and horizontally within a container that spans at least 50% of the viewport height.
 *
 * @example
 * <Loading />
 */
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
} 