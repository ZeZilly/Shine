import { useState, useEffect, createContext, useContext } from "react";

type Language = "tr" | "en";

type Translations = {
  [key: string]: {
    tr: string;
    en: string;
  };
};

const translations: Translations = {
  home: {
    tr: "Ana Sayfa",
    en: "Home"
  },
  services: {
    tr: "Hizmetlerimiz",
    en: "Services"
  },
  about: {
    tr: "Hakkımızda",
    en: "About"
  },
  contact: {
    tr: "İletişim",
    en: "Contact"
  },
  booking: {
    tr: "Randevu Al",
    en: "Book Appointment"
  },
  privacy: {
    tr: "Gizlilik Politikası",
    en: "Privacy Policy"
  },
  terms: {
    tr: "Kullanım Koşulları",
    en: "Terms of Service"
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Provides a context for managing and accessing the application's language settings.
 *
 * This component initializes the language from local storage (defaulting to Turkish) and updates both
 * local storage and the document's language attribute whenever the language changes. It also supplies
 * a translation function that returns the translation for a given key based on the active language,
 * defaulting to the key itself if no translation is available.
 *
 * @param children - The React elements that will have access to the language context.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem("language") as Language) || "tr"
  );

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Returns the current language context.
 *
 * This hook provides access to the language setting, a function to update it, and a translation function
 * that retrieves localized strings based on the current language. It must be used within a LanguageProvider;
 * otherwise, an error is thrown.
 *
 * @throws {Error} If the hook is invoked outside a LanguageProvider.
 * @returns The current language context.
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
} 