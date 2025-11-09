import PropTypes from "prop-types";

const NoHeaderAndFooterLayout = ({ children }) => {
   return <div>{children}</div>;
};

NoHeaderAndFooterLayout.propTypes = {
   children: PropTypes.node.isRequired,
};

export default NoHeaderAndFooterLayout;
