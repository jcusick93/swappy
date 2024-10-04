import * as React from "react";
import styles from "./styles.module.scss";
import { motion, MotionProps } from "framer-motion";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  before?: React.ReactNode;
  after?: React.ReactNode;
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  before,
  after,
  disabled,
  variant = "primary",
  ...rest
}) => {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.95 }} // Disable tap animation when button is disabled
      whileHover={disabled ? undefined : { scale: 1.05 }} // Disable hover animation when button is disabled
      className={`${styles.button} ${
        variant === "primary"
          ? styles.buttonVariantPrimary
          : styles.buttonVariantSecondary
      }`}
      disabled={disabled} // Explicitly passing disabled
      {...(rest as unknown as MotionProps)}
    >
      {before && <span>{before}</span>}
      {children}

      {after && <span>{after}</span>}
    </motion.button>
  );
};
