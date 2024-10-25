import * as React from "react";
import styles from "./styles.module.scss";

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
}

export const Switch: React.FC<SwitchProps> = ({ label, id, ...rest }) => {
  return (
    <label htmlFor={id} className={styles.switch}>
      <input type="checkbox" id={id} {...rest} />
      <div className={styles.switchTrack}>
        <div className={styles.switchThumb}>
          <span className={styles.thumbFront}></span>
          <span className={styles.thumbBackplate}></span>
        </div>
      </div>
      {label && <div>{label}</div>}
    </label>
  );
};
