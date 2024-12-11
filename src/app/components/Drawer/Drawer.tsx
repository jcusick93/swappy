import * as React from "react";
import { Stack } from "../Stack/Stack";
import { IconButton } from "../IconButton/IconButton";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import { ArrowLeftOutlined16 } from "../Icons/ArrowLeftOutlined16";
import { Tooltip } from "../Tooltip/Tooltip";

export interface DrawerProps {
  children?: React.ReactNode;
  title?: string;
  open?: boolean;
  onClose?: () => void;
}

const drawerVariants = {
  open: { x: 0 }, // Position when open
  closed: { x: "100%" }, // Position when closed
};

export const Drawer: React.FC<DrawerProps> = ({
  children,
  title,
  open,
  onClose,
}) => {
  const [isVisible, setIsVisible] = React.useState(open);

  React.useEffect(() => {
    if (open) {
      setIsVisible(true);
    }
  }, [open]);

  const handleClose = () => {
    onClose && onClose();
    // Delay hiding the drawer until the animation is complete
    setTimeout(() => setIsVisible(false), 200); // Match the duration of your animation
  };

  return (
    <motion.section
      className={styles.drawer}
      style={{ display: isVisible ? "inline-block" : "none" }}
      initial="closed"
      animate={open ? "open" : "closed"}
      variants={drawerVariants}
      transition={{
        type: "tween",
        duration: 0.2,
        ease: "easeInOut",
      }}
      onAnimationComplete={(definition) => {
        if (definition === "closed") {
          setIsVisible(false);
        }
      }}
    >
      <Stack
        as="header"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        gap="4px"
        className={styles.drawerHeader}
      >
        <Tooltip label="Close drawer" position="right">
          <IconButton
            label="Close drawer"
            icon={<ArrowLeftOutlined16 />}
            onClick={handleClose}
          />
        </Tooltip>
        <h2 className={styles.drawerTitle}>{title}</h2>
      </Stack>

      <section className={styles.drawerBody}>{children}</section>
    </motion.section>
  );
};
