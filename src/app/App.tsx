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

  return (
    <div className={styles.container}>
      <SegmentedControl value={state} onChange={(value) => setState(value)}>
        <SegmentedControlOption value="byPage" name="selection-type">
          By page
        </SegmentedControlOption>
        <SegmentedControlOption value="bySelection" name="selection-type">
          By selection
        </SegmentedControlOption>
      </SegmentedControl>
      <div className={styles.spacer}></div>
      <Button before={<RefreshOutlined16 />} onClick={handleClick}>
        Get swapped
      </Button>
    </div>
  );
};

export default App;
