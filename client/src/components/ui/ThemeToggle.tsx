import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

/**
 * A toggle button for switching between dark and light themes.
 *
 * This component uses a custom theme hook to read and update the current theme. When clicked, it toggles
 * the theme between "dark" and "light". The button displays a Sun icon for the light theme and a Moon icon
 * for the dark theme, with CSS transitions applied for smooth animations.
 *
 * @returns A React element representing the theme toggle button.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Tema değiştir"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
} 