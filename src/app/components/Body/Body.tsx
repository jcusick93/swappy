import * as React from "react";
import styles from "./styles.module.scss";

export interface BodyProps {
  children: React.ReactNode;
}

export const Body: React.FC<BodyProps> = ({ children }) => {
  return <div className={styles.body}>{children}</div>;
};
