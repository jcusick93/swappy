import * as React from "react";
import { motion } from "framer-motion"; // Import motion from framer-motion
import styles from "./styles.module.scss";

export interface SegmentedControlProps {
  children?: React.ReactNode;
}

export interface SegmentedControlOption
  extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  before?: React.ReactNode;
}

// The option that goes inside the SegmentedControl
export const SegmentedControlOption: React.FC<SegmentedControlOption> = ({
  children,
  before,
  ...rest
}) => {
  return (
    <label className={styles.segmentedControlOption}>
      <input type="radio" {...rest} />
      <span className={styles.segmentedControlOptionContainer}>{children}</span>
    </label>
  );
};

// The parent container
export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  children,
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0); // State to track the selected index

  // Get all options to calculate the width and position of the backplate
  const options = React.Children.toArray(children);

  const backplateWidth = 100 / options.length;
  const margin = 4;

  return (
    <div className={styles.segmentedControl}>
      <motion.div
        style={{
          width: `calc(${backplateWidth}% - ${margin}px)`,
        }}
        initial={{ left: margin }}
        className={styles.backplate} // Class for styling the backplate
        animate={{
          left:
            selectedIndex === 0
              ? `calc(${selectedIndex * backplateWidth}% + ${margin}px)`
              : `${selectedIndex * backplateWidth}%`,
          // left: `calc(${selectedIndex * backplateWidth}% + ${margin}px)`,
        }}
        transition={{
          type: "tween",
          stiffness: 0,
          ease: [0.71, 0, 0.06, 1],
          duration: 0.3,
        }} // Adjusted transition settings
      />
      {React.Children.map(options, (option, index) => {
        return React.cloneElement(option as React.ReactElement, {
          onChange: () => setSelectedIndex(index), // Update selected index on change
          checked: selectedIndex === index, // Check if this option is selected
        });
      })}
    </div>
  );
};
