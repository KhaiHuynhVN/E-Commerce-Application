import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en, vi } from "../../assets/translations";
import { languageConstants } from "../constants";

const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

// Lấy language từ localStorage nếu có, không thì dùng "en" mặc định
const savedLanguage = localStorage.getItem(languageConstants.STORAGE_KEY);
const defaultLanguage = savedLanguage || "en";

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
