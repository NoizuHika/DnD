import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import '@formatjs/intl-pluralrules/polyfill';

import en from './locales/en.json';
import pl from './locales/pl.json';
import ru from './locales/ru.json';
import ua from './locales/ua.json';

const resources = {
  en: { translation: en },
  pl: { translation: pl },
  ru: { translation: ru },
  ua: { translation: ua },
};

const getBestAvailableLanguage = () => {
  const locales = RNLocalize.getLocales();
  console.log('Available locales:', locales);
  for (let locale of locales) {
    const languageTag = locale.languageTag.split('-')[0];
    if (resources[languageTag]) {
      console.log(`Using language: ${languageTag}`);
      return languageTag;
    }
  }
  console.log('Defaulting to language: en');
  return 'en';
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    const languageTag = getBestAvailableLanguage();
    console.log(`Detected language: ${languageTag}`);
    callback(languageTag);
  },
  init: () => {
    console.log('Language detector initialized');
  },
  cacheUserLanguage: (lng) => {
    console.log(`Caching user language: ${lng}`);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources,
    react: {
      useSuspense: false,
    },
  })
  .then(() => {
    console.log('i18next initialized');
  })
  .catch((error) => {
    console.error('i18next initialization failed', error);
  });

export default i18n;
