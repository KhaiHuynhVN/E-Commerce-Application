import propTypes from "prop-types";

import "./GlobalStyle.scss";
import "../../themes/themes.scss";

const GlobalStyle = ({ children }) => {
   return children;
};

GlobalStyle.propTypes = {
   children: propTypes.node.isRequired,
};

export default GlobalStyle;
