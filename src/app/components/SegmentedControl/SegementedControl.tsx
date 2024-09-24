import * as React from "react";
import styles from "./styles.module.scss";
import "./styles.module.scss";

export interface SegmentedControlProps {
  children?: React.ReactNode;
}

export interface SegmentedControlOption
  extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  before?: React.ReactNode;
}

// The option that goes inside the SegmentedControl
export const SegmentedControlOption: React.FC<SegmentedControlOption> = ({
  children,
  before,
  ...rest
}) => {
  return (
    <label className={styles.segmentedControlOption}>
      <input type="radio" {...rest} />
      <span className={styles.segmentedControlOptionContainer}>{children}</span>
    </label>
  );
};

// The parent container
export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  children,
}) => {
  return <div className={styles.segmentedControl}>{children}</div>;
};
