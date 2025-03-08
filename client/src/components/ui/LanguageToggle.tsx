import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";

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