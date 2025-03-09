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

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
} 