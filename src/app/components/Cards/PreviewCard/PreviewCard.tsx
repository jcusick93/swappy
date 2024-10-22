import * as React from "react";
import styles from "./styles.module.scss";
import { Checkbox } from "../../Checkbox/Checkbox";
import { ArrowRightOutlined12 } from "../../Icons/ArrowRightOutlined12";

export interface PreviewCardProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  oldImage: string;
  newImage: string;
  checked?: boolean;

  id: string;
  defaultChecked?: boolean;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  oldImage,
  newImage,

  id,
  defaultChecked,
  ...rest
}) => {
  return (
    <div className={styles.previewCard}>
      {/* stack that holds images */}
      <div className={styles.previewCardImgStack}>
        {/* image container 1 */}
        <div className={styles.previewCardImgContainer}>
          <img src={oldImage} />
        </div>
        <ArrowRightOutlined12 />
        {/* image container 2 */}
        <div className={styles.previewCardImgContainer}>
          <img src={newImage} />
        </div>
      </div>
      <div className={styles.previewCardCheckboxContainer}>
        <Checkbox id={id} {...rest} />
      </div>
    </div>
  );
};
