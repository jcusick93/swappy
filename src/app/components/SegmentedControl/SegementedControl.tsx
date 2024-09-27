import * as React from "react";

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

  // Find the index of the selected option
  const selectedIndex = options.findIndex(
    (option) => option.props.value === value
  );

  const margin = 4;
  let dymanicSpace = selectedIndex === 0 ? "4px" : "0px";

  return (
    <div className={styles.segmentedControl}>
      {React.Children.map(options, (option) => {
        return React.cloneElement(option as React.ReactElement, {
          onChange: () => {
            onChange(option.props.value); // Call the parent's onChange handler with the value
          },
          checked: option.props.value === value, // Check if this option is selected
        });
      })}
      {/* backplate */}
      <div
        className={styles.backplate}
        style={{
          width: `calc(${backplateWidth}% - ${margin}px)`,
          left: `calc(${selectedIndex * backplateWidth}% + ${dymanicSpace})`,
          transformOrigin:
            selectedIndex === options.length - 1 ? "right" : "left",
        }}
      />
    </div>
  );
};
