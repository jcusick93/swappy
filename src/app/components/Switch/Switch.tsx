import * as React from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
}

export const Switch: React.FC<SwitchProps> = ({ label, id, ...rest }) => {
  const [isPressed, setIsPressed] = React.useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  return (
    <label htmlFor={id} className={styles.switch}>
      <input type="checkbox" id={id} {...rest} />
      <div
        className={styles.switchTrack}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // To handle case when mouse leaves while pressed
      >
        <motion.div
          className={styles.switchThumb}
          initial={{ left: 2, scale: 1 }}
          animate={{ left: rest.checked ? 20 : 2, scale: isPressed ? 0.8 : 1 }}
          transition={{ duration: 0.12 }}
        >
          <span className={styles.thumbFront}></span>
          <motion.span
            className={styles.thumbBackplate}
            initial={{ height: 4, width: 4 }}
            animate={{
              height: rest.checked ? 100 : 4,
              width: rest.checked ? 100 : 4,
            }}
            transition={{ duration: 0.2, delay: 0.1 }}
          ></motion.span>
        </motion.div>
      </div>
      {label && <div>{label}</div>}
    </label>
  );
};
