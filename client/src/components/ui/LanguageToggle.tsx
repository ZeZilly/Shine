import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";

/**
 * Renders a button that toggles the application's language.
 *
 * This React component uses the `useLanguage` hook to access the current language and update it. When clicked, the button switches the language from Turkish ("tr") to English ("en") or vice versa. The button label reflects the alternative language ("EN" when the current language is Turkish and "TR" when it is English).
 */
export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
      className="font-medium"
    >
      {language === "tr" ? "EN" : "TR"}
    </Button>
  );
} 