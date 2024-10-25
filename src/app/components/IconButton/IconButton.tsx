import * as React from "react";
import styles from "./styles.module.scss";
import { motion, MotionProps } from "framer-motion";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  disabled,
  ...rest
}) => {
  return (
    <motion.button
      aria-label={label}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.9 }}
      className={styles.iconButton}
      {...(rest as unknown as MotionProps)}
    >
      {icon}
    </motion.button>
  );
};
