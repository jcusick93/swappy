import * as React from "react";
import styles from "./styles.module.scss";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  id: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  children,
  id,
  ...rest
}) => {
  return (
    <label htmlFor={id} className={styles.checkbox}>
      <input type="checkbox" id={id} {...rest} />
      <div className={styles.checkboxSquare}></div>
      {children && <span>{children}</span>}
    </label>
  );
};
