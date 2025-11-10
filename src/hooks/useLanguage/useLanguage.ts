import { useTranslation } from "react-i18next";

import { languageConstants, commonConstants } from "../../utils";

const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang = languageConstants.EN) => {
    localStorage.setItem(commonConstants.LANGUAGE, lang);
    i18n.changeLanguage(lang);
  };

  const initLanguage = () => {
    const langStore = localStorage.getItem(commonConstants.LANGUAGE);

    if (!langStore || !Object.values(languageConstants).includes(langStore)) {
      changeLanguage(languageConstants.EN);
    } else {
      changeLanguage(langStore);
    }
  };

  return {
    changeLanguage,
    initLanguage,
    currentLanguage: i18n.language,
  };
};

export default useLanguage;
