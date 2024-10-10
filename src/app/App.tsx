import * as React from "react";
import {
  Button,
  SegmentedControl,
  SegmentedControlOption,
  PreviewCard,
  Stack,
  Footer,
  Body,
} from "./components";
import { RefreshOutlined16 } from "./components/Icons/RefreshOutlined16";
import styles from "./app.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import Tourchie from "./assets/images/happy_torchie.gif";

const App = () => {
  // Set default checked option
  const [state, setState] = React.useState("byPage");
  // Store components with old/new images
  const [scannedComponents, setScannedComponents] = React.useState([]);
  // To track checked components
  const [checkedComponents, setCheckedComponents] = React.useState([]);
  // Sets loading for Swapped button
  const [swapLoading, setSwapLoading] = React.useState(false);
  // Sets loading for Scanning button
  const [scanLoading, setScanLoading] = React.useState(false);

  const buttonLabelTransition = {
    type: "tween",
    ease: [0.05, 0.7, 0.1, 1],
    duration: 0.4,
    filter: { delay: 0.08 },
    transform: { delay: 0.08 },
  };

  // Listen for messages from the Figma plugin
  React.useEffect(() => {
    window.onmessage = (event) => {
      const { pluginMessage } = event.data;
      if (pluginMessage.type === "COMPONENT_IMAGES") {
        setScannedComponents(pluginMessage.componentImages); // Set scanned components
        // Initialize checked components array
        setCheckedComponents(
          new Array(pluginMessage.componentImages.length).fill(true)
        );
      } else if (pluginMessage.type === "SWAP_COMPLETE") {
        setSwapLoading(false); // Set loading to false when swap is complete
      } else if (pluginMessage.type === "SCAN_COMPLETE") {
        setScanLoading(false);
      }
    };
  }, []);

  const handleScanClick = () => {
    // Trigger the scan based on current state (byPage or bySelection)
    setTimeout(() => {
      setScanLoading(true);
      parent.postMessage(
        {
          pluginMessage: {
            type: "SCAN_COMPONENTS",
            scanType: state, // Send the current state ('byPage' or 'bySelection')
          },
        },
        "*"
      );
      // timeout is needed to avoid button from "sticking"
    }, 400);
  };

  const handleSwapClick = () => {
    // Send message to swap the selected components
    setTimeout(() => {
      setSwapLoading(true);
      parent.postMessage(
        {
          pluginMessage: {
            type: "SWAP_COMPONENTS",
            checkedStates: checkedComponents, // Send the checked states
          },
        },
        "*"
      );
      // timeout is needed to avoid button from "sticking"
    }, 400);
  };

  const handleCheckboxChange = (index) => {
    // Update the checked state of the specific component
    setCheckedComponents((prevChecked) => {
      const updatedChecked = [...prevChecked];
      updatedChecked[index] = !updatedChecked[index]; // Toggle the checked state

      // Update the scannedComponents with the new checked state
      setScannedComponents((prevComponents) =>
        prevComponents.map((component, i) => {
          if (i === index) {
            return { ...component, checked: updatedChecked[i] }; // Update checked property
          }
          return component;
        })
      );

      return updatedChecked;
    });
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
      <Body>
        <Stack flexDirection="column" gap="8px">
          {scannedComponents.length > 0 ? (
            scannedComponents.map((component, index) => (
              <AnimatePresence key={index}>
                <motion.div
                  key={index}
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.12,
                  }}
                  initial={{ y: 4, opacity: 0.5 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 4, opacity: 0.5 }}
                >
                  <PreviewCard
                    oldImage={component.oldImage}
                    oldImageAlt="Old component preview"
                    newImage={component.newImage}
                    newImageAlt="New component preview"
                    id={`component-${index}`}
                    defaultChecked
                    // checked={component.checked} // Use the checked state from component
                    onChange={() => handleCheckboxChange(index)} // Handle checkbox change
                  />
                </motion.div>
              </AnimatePresence>
            ))
          ) : (
            <div>
              {scanLoading ? (
                <Stack
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <div>
                    <img
                      style={{ height: 96 }}
                      src={Tourchie}
                      alt="Loading..."
                    />
                  </div>

                  <span>Hang tight! Scanning your components now...</span>
                </Stack>
              ) : (
                <p>No components found</p>
              )}
            </div>
          )}
        </Stack>
      </Body>

      {/* Button to trigger the component scan */}

      <Footer>
        <Button
          variant="secondary"
          style={{ width: "100%" }}
          onClick={handleScanClick} // Trigger the scan when clicked
        >
          <span className={styles.buttonLabelWrapper}>
            <Stack
              gap="0px"
              flexDirection="column"
              justifyContent="center"
              style={{ position: "relative" }}
            >
              <motion.span
                className={styles.buttonLabel}
                transition={buttonLabelTransition}
                initial={{ top: 0 }}
                animate={{
                  top: state === "bySelection" ? -20 : 0,
                  filter: state === "bySelection" ? "blur(1px)" : "blur(0px)",
                }}
              >
                Scan page
              </motion.span>
              <motion.span
                className={styles.buttonLabel}
                transition={buttonLabelTransition}
                initial={{ top: 20, filter: "blur(1px)" }}
                animate={{
                  top: state === "bySelection" ? 0 : 20,
                  filter: state === "bySelection" ? "blur(0px)" : "blur(1px)",
                }}
              >
                Scan selection
              </motion.span>
            </Stack>
          </span>
        </Button>

        {/* Button to trigger the component swap */}
        <Button
          loading={swapLoading}
          before={<RefreshOutlined16 />}
          disabled={scannedComponents.length === 0 || swapLoading} // Disable if no components
          onClick={handleSwapClick} // Trigger the swap when clicked
          style={{ width: "100%" }}
        >
          {swapLoading ? "Loading" : "Get swapped"}
        </Button>
      </Footer>
    </div>
  );
};

export default App;
