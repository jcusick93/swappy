import * as React from "react";
import styles from "./styles.module.scss";

export interface LoaderProps {
  ariaLabel?: string;
  style?: React.CSSProperties;
}

// Spinner component
export const Loader: React.FC<LoaderProps> = ({ style }) => {
  const dynamicSize = 32; // Fixed size
  const strokeWidth = 4; // Fixed stroke width

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
    >
      <svg
        className={styles.svg}
        style={{ height: dynamicSize, width: dynamicSize }}
      >
        {/* track */}
        <circle
          cx="50%"
          cy="50%"
          strokeWidth={strokeWidth}
          // the radius is calculated automatically with this function
          r={(dynamicSize - strokeWidth) / 2}
          fill="none"
          stroke="currentColor"
          style={{ opacity: 0.2 }}
        ></circle>
        {/* tail */}
        <circle
          cx="50%"
          cy="50%"
          strokeWidth={strokeWidth}
          // the radius is calculated automatically with this function
          r={(dynamicSize - strokeWidth) / 2}
          fill="none"
          stroke="currentColor"
          className={styles.svgTail}
          style={{ opacity: 1 }}
        />
      </svg>
    </div>
  );
};
