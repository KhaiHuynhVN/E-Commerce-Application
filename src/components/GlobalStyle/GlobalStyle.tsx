import { type ReactNode } from "react";

import { type GlobalStyleProps } from "./GlobalStyle.types";

import "./GlobalStyle.scss";
import "../../themes/themes.scss";

const GlobalStyle = ({ children }: GlobalStyleProps): ReactNode => {
  return children;
};

export default GlobalStyle;
