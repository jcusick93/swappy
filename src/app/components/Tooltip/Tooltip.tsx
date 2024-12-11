import React, { useState, useRef } from "react";
import styles from "./styles.module.scss";

export interface TooltipProps {
  label: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export const Tooltip: React.FC<TooltipProps> = ({
  label,
  children,
  position = "bottom",
}) => {
  const [active, setActive] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  let timeout: number | undefined;

  const showTip = () => {
    timeout = window.setTimeout(() => {
      setActive(true);
    }, 400);
  };

  const hideTip = () => {
    clearTimeout(timeout);
    setActive(false);
  };

  return (
    <div
      className={styles.tooltipWrapper}
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      ref={wrapperRef}
    >
      {children}
      {active && (
        <div
          className={`${styles.tooltip} ${styles[position]}`}
          ref={tooltipRef}
        >
          {label}
        </div>
      )}
    </div>
  );
};
