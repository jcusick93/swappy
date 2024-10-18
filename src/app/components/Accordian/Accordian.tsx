import * as React from "react";
import { Stack } from "../Stack/Stack";
import styles from "./styles.module.scss";

export interface AccordianProps {
  title: string;
  children: React.ReactNode;
  defaultOpened?: boolean;
}

export const Accordian: React.FC<AccordianProps> = ({
  title,
  children,
  defaultOpened,
}) => {
  const [open, setOpen] = React.useState(true);
  return (
    <Stack flexDirection="column" gap="0px" className={styles.accordian}>
      <button onClick={() => setOpen(!open)} className={styles.accordianButton}>
        {title}
      </button>
      <div style={{ display: !open ? "none" : "block" }}>{children}</div>
    </Stack>
  );
};
