import * as React from "react";
import styles from "./styles.module.scss";

export interface FooterProps {
  children: React.ReactNode;
}

export const Footer: React.FC<FooterProps> = ({ children }) => {
  return <footer className={styles.footer}>{children}</footer>;
};
