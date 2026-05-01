import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { format, parseISO } from 'date-fns';
import { localeMeta, translations, type Language, type TranslationTree } from '../translations';

type DateFormatOptions = Intl.DateTimeFormatOptions;

interface LocalizationContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationTree;
  localeCode: string;
  calendarLocale: (typeof localeMeta)[Language]['calendar'];
  formatDateValue: (value: string | Date, options?: DateFormatOptions) => string;
  formatDate: (iso: string, fmt?: string) => string;
  formatDateTime: (iso: string) => string;
  formatTime: (iso: string) => string;
  interpolate: (template: string, values: Record<string, string | number>) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('app-language') as Language;
    return savedLang || 'ru';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app-language', newLang);
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang];
  const meta = localeMeta[lang];

  const interpolate = (template: string, values: Record<string, string | number>) =>
    Object.entries(values).reduce(
      (result, [key, value]) => result.replaceAll(`{{${key}}}`, String(value)),
      template
    );

  const parseDateValue = (value: string | Date) => {
    if (value instanceof Date) return value;
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date(value);
  };

  const formatDateValue = (value: string | Date, options: DateFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }) => new Intl.DateTimeFormat(meta.intl, options).format(parseDateValue(value));

  const formatDate = (iso: string, fmt = 'dd MMM yyyy') =>
    format(parseISO(iso), fmt, { locale: meta.dateFns });

  const formatDateTime = (iso: string) =>
    format(parseISO(iso), 'dd MMM yyyy, HH:mm', { locale: meta.dateFns });

  const formatTime = (iso: string) =>
    format(parseISO(iso), 'HH:mm');

  return (
    <LocalizationContext.Provider
      value={{
        lang,
        setLang,
        t,
        localeCode: meta.intl,
        calendarLocale: meta.calendar,
        formatDateValue,
        formatDate,
        formatDateTime,
        formatTime,
        interpolate,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return context;
};
