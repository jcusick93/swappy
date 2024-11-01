import * as React from "react";
import styles from "./styles.module.scss";
import { CheckmarkOutlined16 } from "../Icons/CheckmarkOutlined16";
import { motion } from "framer-motion";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, label, ...rest }) => {
  return (
    <label htmlFor={id} className={styles.checkbox}>
      <input type="checkbox" {...rest} id={id} />
      <motion.div
        className={styles.checkboxCircle}
        whileTap={rest.disabled ? undefined : { scale: 0.9 }}
      >
        <motion.div className={styles.checkboxCheckmarkContainer}>
          <span className={styles.checkmark}>
            <CheckmarkOutlined16 />
          </span>
          <div className={styles.containerBackplate} />
        </motion.div>
      </motion.div>
      {label && <div>{label}</div>}
    </label>
  );
};
