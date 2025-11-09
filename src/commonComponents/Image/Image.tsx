import classNames from "classnames/bind";
import { memo, type ImgHTMLAttributes, type SyntheticEvent } from "react";
import { images } from "../../assets";

import styles from "./Image.module.scss";

const cx = classNames.bind(styles);

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Đường dẫn ảnh */
  src?: string;

  /** CSS class bổ sung */
  className?: string;

  /** Alt text cho ảnh */
  alt?: string;
}

const Image = ({
  src = images.defaultImage,
  className,
  alt = "default_image",
  ...props
}: ImageProps) => {
  const classes = cx("wrapper", className);

  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = images.defaultImage;
  };

  return (
    <img
      className={classes}
      alt={alt}
      src={src}
      onError={handleError}
      {...props}
    />
  );
};

export default memo(Image);
