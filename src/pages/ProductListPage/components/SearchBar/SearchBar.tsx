import { memo } from "react";
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";

import { Icons } from "@/assets";
import { Button, Input } from "@/commonComponents";
import type { SearchBarProps } from "./SearchBar.types";

import styles from "./SearchBar.module.scss";

const cx = classNames.bind(styles);

const SearchBar = ({ value, onChange, placeholder }: SearchBarProps) => {
  const { t } = useTranslation();

  return (
    <div className={cx("wrapper", "relative")}>
      <div className={cx("searchIcon")}>
        <Icons.SearchIcon width="20" height="20" strokeWidth="2" />
      </div>

      <Input
        type="text"
        value={value}
        onChange={(value) => onChange(value)}
        placeholder={placeholder || t("common.search")}
        inputClassName={cx("input", "w-full rounded-full!")}
      />

      {value && (
        <Button
          onClick={() => onChange("")}
          className={cx("clearButton")}
          styleType="secondary"
          aria-label="Clear search"
        >
          <Icons.CloseIcon width="16" height="16" strokeWidth="2.5" />
        </Button>
      )}
    </div>
  );
};

export default memo(SearchBar);
