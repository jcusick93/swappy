import * as React from "react";
import styles from "./styles.module.scss";
import { motion, MotionProps } from "framer-motion";
import { Stack } from "../Stack/Stack";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  before?: React.ReactNode;
  after?: React.ReactNode;
  variant?: "primary" | "secondary";
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  before,
  after,
  disabled,
  variant = "primary",
  loading = false,
  ...rest
}) => {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.95 }} // Disable tap animation when button is disabled
      // Disable hover animation when button is disabled
      className={`${styles.button} ${
        variant === "primary"
          ? styles.buttonVariantPrimary
          : styles.buttonVariantSecondary
      }`}
      disabled={disabled || loading} // Explicitly passing disabled
      {...(rest as unknown as MotionProps)}
    >
      <Stack
        gap="4px"
        justifyContent="center"
        alignItems="center"
        style={{ width: "100%", color: "inherit" }}
      >
        {before && <span>{before}</span>}
        {children}
        {after && <span>{after}</span>}
      </Stack>
    </motion.button>
  );
};
