import * as React from "react";
import { Button, SegmentedControl, SegmentedControlOption } from "./components";
import { RefreshOutlined16 } from "./components/Icons/RefreshOutlined16";
import styles from "./app.module.scss";

const App = () => {
  const [state, setState] = React.useState("byPage"); // Set default checked option

  const handleClick = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "SWAP_BUTTONS",
          state: state,
        },
      },
      "*"
    );
  };

  const handleChange = (event) => {
    setState(event.target.value); // Update checked state on change
  };

  return (
    <div className={styles.container}>
      <div>
        <SegmentedControl>
          <SegmentedControlOption
            name="selector"
            value="byPage"
            checked={state === "byPage"} // Check if this option is selected
            onChange={handleChange} // Handle change event
          >
            By Page
          </SegmentedControlOption>
          <SegmentedControlOption
            name="selector"
            value="bySelection"
            checked={state === "bySelection"} // Check if this option is selected
            onChange={handleChange} // Handle change event
          >
            By Selection
          </SegmentedControlOption>
        </SegmentedControl>
      </div>
      <div className={styles.spacer}></div>
      <Button before={<RefreshOutlined16 />} onClick={handleClick}>
        Get swapped
      </Button>
    </div>
  );
};

export default App;
