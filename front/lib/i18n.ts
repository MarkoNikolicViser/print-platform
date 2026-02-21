import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import commonEn from '../locales/en/common.json';
import commonRu from '../locales/ru/common.json';
import commonSr from '../locales/sr/common.json';

const resources = {
  sr: {
    common: commonSr,
  },
  en: {
    common: commonEn,
  },
  ru: {
    common: commonRu,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'sr',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
