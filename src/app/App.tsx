import * as React from "react";
import { Button, SegmentedControl, SegmentedControlOption } from "./components";
import { RefreshOutlined16 } from "./components/Icons/RefreshOutlined16";

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
    <div style={{ padding: 16 }}>
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
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "end",
          flexDirection: "column",
        }}
      >
        <Button before={<RefreshOutlined16 />} onClick={handleClick}>
          Get swapped
        </Button>
      </div>
    </div>
  );
};

export default App;
