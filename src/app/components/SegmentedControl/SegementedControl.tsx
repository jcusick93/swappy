import * as React from "react";
import { motion } from "framer-motion"; // Import motion from framer-motion
import styles from "./styles.module.scss";

export interface SegmentedControlProps {
  children?: React.ReactNode;
  value: string; // Use string type for the value prop
  onChange: (value: string) => void; // Define onChange to accept a string
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
  value, // Destructure value from props
  onChange, // Destructure onChange from props
}) => {
  // Get all options to calculate the width and position of the backplate
  const options = React.Children.toArray(children) as React.ReactElement[]; // Type assertion to ReactElement[]
  const backplateWidth = 100 / options.length;
  const margin = 4;
  // Find the index of the selected option
  const selectedIndex = options.findIndex(
    (option) => option.props.value === value
  );

  let dymanicSpace = selectedIndex === 0 ? "4px" : "0px";

  return (
    <div className={styles.segmentedControl}>
      <motion.div
        style={{
          width: `calc(${backplateWidth}% - ${margin}px)`,
        }}
        initial={{ left: margin }}
        className={styles.backplate} // Class for styling the backplate
        animate={{
          left: `calc(${selectedIndex * backplateWidth}% + ${dymanicSpace})`,
        }}
        transition={{
          type: "tween",
          stiffness: 0,
          ease: [0.71, 0, 0.06, 1],
          duration: 0.3,
        }} // Adjusted transition settings
      />
      {React.Children.map(options, (option) => {
        return React.cloneElement(option as React.ReactElement, {
          onChange: () => {
            onChange(option.props.value); // Call the parent's onChange handler with the value
          },
          checked: option.props.value === value, // Check if this option is selected
        });
      })}
    </div>
  );
};
