// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";

import { translationConfig } from "./utils";
import App from "./App.tsx";
import { GlobalStyle } from "./components";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <I18nextProvider i18n={translationConfig}>
    <GlobalStyle>
      <App />
    </GlobalStyle>
  </I18nextProvider>
  // </StrictMode>,
);
