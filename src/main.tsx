// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";

import { translationConfig } from "@/utils";
import store from "@/store";
import App from "@/App";
import { GlobalStyle } from "@/components";

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
