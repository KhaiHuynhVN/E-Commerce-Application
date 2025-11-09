// Clean export pattern for VirtualTable component
export { default } from "./VirtualTable";

// Export cell utilities và constants cho custom cell implementations
export {
  CELL_BASE_PROP_KEYS,
  cellPropsAreEqual,
  HEADER_BASE_PROP_KEYS,
  headerCellPropsAreEqual,
  FOOTER_BASE_PROP_KEYS,
  footerCellPropsAreEqual,
  DEFAULT_SCROLLBAR_CONFIG,
  DEFAULT_BORDER_CONFIG,
} from "./utils";
