import * as React from "react";
import styles from "./styles.module.scss";
import { CheckmarkOutlined16 } from "../Icons/CheckmarkOutlined16";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  children,
  id,
  ...rest
}) => {
  return (
    <label className={styles.checkbox}>
      <input type="checkbox" id={id} {...rest}></input>
      <div className={styles.checkboxSquare}>
        <CheckmarkOutlined16 />
      </div>
      {children && <span>{children}</span>}
    </label>
  );
};
