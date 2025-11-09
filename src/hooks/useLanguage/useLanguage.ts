import { useTranslation } from "react-i18next";

import { globalService as glb_sv, storeKey as STORE_KEY, languageConstants } from "../../utils";

const useLanguage = () => {
   const { i18n } = useTranslation();

   const changeLanguage = (lang = languageConstants.EN) => {
      localStorage.setItem(STORE_KEY.LANGUAGE, lang);
      i18n.changeLanguage(lang);
      glb_sv.language = lang;
   };

   const initLanguage = () => {
      const langStore = localStorage.getItem(STORE_KEY.LANGUAGE);

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
