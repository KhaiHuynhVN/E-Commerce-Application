// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";

import { translationConfig } from "@/utils";
import store from "@/store";
import App from "@/App";
import { GlobalStyle } from "@/components";

/**
 * Disable console.log trong production mode
 * Giữ lại console.warn và console.error để debug critical issues
 */
if (import.meta.env.PROD) {
  console.log = () => {};
  // console.warn và console.error vẫn hoạt động bình thường
}

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Provider store={store}>
    <I18nextProvider i18n={translationConfig}>
      <GlobalStyle>
        <App />
      </GlobalStyle>
    </I18nextProvider>
  </Provider>
  // </StrictMode>,
);
