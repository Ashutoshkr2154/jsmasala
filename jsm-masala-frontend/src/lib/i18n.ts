import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // Loads translations from /public/locales
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    // Default language
    lng: 'en',
    // Fallback language if translation is missing
    fallbackLng: 'en',
    
    // Namespaces (you can split translations into multiple files)
    ns: ['common', 'product', 'checkout'],
    defaultNS: 'common',

    // Debugging (set to true to see logs in console)
    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Config for i18next-http-backend
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;