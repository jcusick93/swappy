import * as React from "react";
import styles from "./styles.module.scss";
import { ArrowRightOutlined16 } from "../../Icons/ArrowRightOutlined";
import { Checkbox } from "../../Checkbox/Checkbox";

export interface PreviewCardProps {
  oldImage: string;
  oldImageAlt: string;
  newImage: string;
  newImageAlt: string;
  checked?: boolean;
  key?: string;
  id: string;
  defaultChecked?: boolean;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  oldImage,
  newImage,
  newImageAlt,
  oldImageAlt,
  key,
  id,
  defaultChecked,
}) => {
  return (
    <div key={key} className={styles.previewCard}>
      {/* stack that holds images */}
      <div className={styles.previewCardImgStack}>
        {/* image container 1 */}
        <div className={styles.previewCardImgContainer}>
          <img src={oldImage} alt={oldImageAlt} />
        </div>
        <ArrowRightOutlined16 />
        {/* image container 2 */}
        <div className={styles.previewCardImgContainer}>
          <img src={newImage} alt={newImageAlt} />
        </div>
      </div>
      <div className={styles.previewCardCheckboxContainer}>
        <Checkbox id={id} defaultChecked={defaultChecked} />
      </div>
    </div>
  );
};
