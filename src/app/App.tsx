import * as React from "react";
import {
  Button,
  SegmentedControl,
  SegmentedControlOption,
  PreviewCard,
} from "./components";
import { RefreshOutlined16 } from "./components/Icons/RefreshOutlined16";
import styles from "./app.module.scss";

const App = () => {
  const [state, setState] = React.useState("byPage"); // Set default checked option
  const [swappedComponents, setSwappedComponents] = React.useState([]); // Store swapped components with images

  // Listen for messages from Figma plugin
  React.useEffect(() => {
    window.onmessage = (event) => {
      const { pluginMessage } = event.data;
      if (pluginMessage.type === "COMPONENT_IMAGES") {
        setSwappedComponents(pluginMessage.componentImages);
      }
    };
  }, []);

  const handleClick = () => {
    // Delay to show the onPress transition of the button
    setTimeout(() => {
      parent.postMessage(
        {
          pluginMessage: {
            type: "SWAP_BUTTONS",
            state: state,
          },
        },
        "*"
      );
    }, 200); // 200 milliseconds delay
  };

  return (
    <div className={styles.container}>
      {/* Segmented control for selecting by page or by selection */}
      <SegmentedControl value={state} onChange={(value) => setState(value)}>
        <SegmentedControlOption value="byPage" name="selection-type">
          By page
        </SegmentedControlOption>
        <SegmentedControlOption value="bySelection" name="selection-type">
          By selection
        </SegmentedControlOption>
      </SegmentedControl>

      {/* Scrollable container for PreviewCards */}
      <div className={styles.scrollContainer}>
        {swappedComponents.length > 0 ? (
          swappedComponents.map((component, index) => (
            <PreviewCard
              key={`component-${index}`}
              oldImage={component.oldImage}
              oldImageAlt="Old component preview"
              newImage={component.newImage}
              newImageAlt="New component preview"
              id={`component-${index}`}
              defaultChecked
            />
          ))
        ) : (
          <p>No swapped components to show</p>
        )}
      </div>

      {/* Button to trigger the component swap */}
      <Button before={<RefreshOutlined16 />} onClick={handleClick}>
        Get swapped
      </Button>
    </div>
  );
};

export default App;
