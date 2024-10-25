import * as React from "react";
import styles from "./styles.module.scss";
import { CheckmarkOutlined16 } from "../Icons/CheckmarkOutlined16";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, ...rest }) => {
  return (
    <label className={styles.checkbox} htmlFor={id}>
      <input type="checkbox" {...rest} id={id} />
      <div className={styles.checkboxCheckmarkContainer}>
        <span className={styles.checkmark}>
          <CheckmarkOutlined16 />
        </span>
        <div className={styles.containerBackplate} />
      </div>
    </label>
  );
};
