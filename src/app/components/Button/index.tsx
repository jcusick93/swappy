import * as React from "react";
import styles from "./styles.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  before?: React.ReactNode;
  after?: React.ReactNode;
  
}


export const Button: React.FC<ButtonProps> = ({ children, before, after, disabled, ...rest }) => {
  return (
    <button className={styles.button} disabled={disabled} {...rest}>
      {before && <span className="button__before">{before}</span>}
      {children}
      {after && <span className="button__after">{after}</span>}
    </button>
  
  );
};

