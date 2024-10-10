import * as React from "react";
import styles from "./styles.module.scss";

export interface HeaderProps {
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  return <header className={styles.header}>{children}</header>;
};
