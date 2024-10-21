import * as React from "react";
import { Stack } from "../Stack/Stack";
import styles from "./styles.module.scss";
import { CaretDownFilled12 } from "../Icons";

export interface AccordianProps {
  title: string;
  children: React.ReactNode;
  defaultOpened?: boolean;
  count: string;
}

export const Accordian: React.FC<AccordianProps> = ({
  title,
  children,
  defaultOpened,
  count,
}) => {
  const [open, setOpen] = React.useState(true);
  return (
    <Stack flexDirection="column" gap="0px" className={styles.accordian}>
      <button onClick={() => setOpen(!open)} className={styles.accordianButton}>
        <span
          className={styles.buttonIconContainer}
          style={{
            transform: !open && "rotate(-90deg)",
          }}
        >
          <CaretDownFilled12 />
        </span>
        {title}
        <span style={{ fontWeight: 400 }}>{count}</span>
      </button>
      <div
        className={styles.accordianChildrenContainer}
        style={{
          display: open || defaultOpened ? "block" : "none",
        }}
      >
        {children}
      </div>
    </Stack>
  );
};
