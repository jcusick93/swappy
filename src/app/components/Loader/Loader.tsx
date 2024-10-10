import * as React from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";

export interface LoaderProps {
  style?: React.CSSProperties;
}

const ContainerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const DotVariants = {
  initial: {
    height: 8,
    width: 8,
  },
  animate: {
    height: 10,
    width: 10,
  },
};

export const Loader: React.FC<LoaderProps> = ({ style }) => {
  return (
    <motion.div style={{ height: "100%", width: "100%", ...style }}>
      <motion.div />
    </motion.div>
  );
};
