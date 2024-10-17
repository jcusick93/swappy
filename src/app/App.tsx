import * as React from "react";
import {
  Button,
  SegmentedControl,
  SegmentedControlOption,
  Header,
  Body,
  Footer,
  Stack,
  Placeholder,
  Checkbox,
} from "./components";
import { RefreshOutlined16 } from "./components/Icons/RefreshOutlined16";
import styles from "./app.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import TorchieGif from "./assets/images/happy_torchie.gif";
import TorchieSurprised from "./assets/images/surprised_torchie.png";
import TorchieCool from "./assets/images/cool_torchie.png";
import TorchieLove from "./assets/images/love_torchie.png";

const App = () => {
  // Set default checked option
  const [state, setState] = React.useState("byPage");
  // Store components with old/new images and checked state
  const [scannedComponents, setScannedComponents] = React.useState([]);
  // Sets loading for Swapped button
  const [swapLoading, setSwapLoading] = React.useState(false);
  // Sets loading for Scanning button
  const [scanLoading, setScanLoading] = React.useState(false);
  // Sets the state for when the scan button has been pressed
  const [nodesScanned, setNodesScanned] = React.useState(false);
  // Store previously checked components before swap so we know what to remove from the scannedComponents array after swapping
  const [previouslyChecked, setPreviouslyChecked] = React.useState([]);
  // Set success state for when the Swap button has been pressed to show a success state after all the nodes are swapped
  const [success, setSuccess] = React.useState(false);

  const buttonLabelTransition = {
    type: "tween",
    ease: [0.05, 0.7, 0.1, 1],
    duration: 0.4,
    filter: { delay: 0.08 },
    transform: { delay: 0.08 },
  };

  const cardAnimation = {
    type: "tween",
    ease: [0.05, 0.7, 0.1, 1],
    duration: 0.4,
  };

  // Listen for messages from the Figma plugin
  React.useEffect(() => {
    window.onmessage = (event) => {
      const { pluginMessage } = event.data;
      if (pluginMessage.type === "COMPONENT_IMAGES") {
        // Set scanned components, default all to checked
        setScannedComponents(
          pluginMessage.componentImages.map((component) => ({
            ...component,
            isChecked: true, // Default checked state
          }))
        );
      } else if (pluginMessage.type === "SWAP_COMPLETE") {
        // Remove previously checked components after swap is complete
        setScannedComponents((prev) =>
          prev.filter((_, index) => !previouslyChecked.includes(index))
        );
        setPreviouslyChecked([]); // Reset checked indexes after swap
        setSwapLoading(false); // Set loading to false when swap is complete
      } else if (pluginMessage.type === "SCAN_COMPLETE") {
        setTimeout(() => {
          setScanLoading(false);
        }, 1000);
      }
    };
  }, [previouslyChecked]);

  const handleScanClick = () => {
    // Trigger the scan based on current state (byPage or bySelection)
    setTimeout(() => {
      setScanLoading(true);
      setNodesScanned(true);
      setScannedComponents([]);
      setSuccess(false);
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
    // Before running the swap, capture the currently checked components
    const currentlyCheckedIndexes = scannedComponents
      .map((component, index) => (component.isChecked ? index : null))
      .filter((index) => index !== null);
    setSuccess(true);

    setPreviouslyChecked(currentlyCheckedIndexes); // Store checked indexes
    setSwapLoading(true); // Set loading to true for the swap
    // Send message to swap the selected components
    parent.postMessage(
      {
        pluginMessage: {
          type: "SWAP_COMPONENTS",
          checkedStates: scannedComponents.map(
            (component) => component.isChecked
          ), // Send the checked states
        },
      },
      "*"
    );
  };

  const handleCheckboxChange = (index) => {
    // Update the checked state of the specific component
    setScannedComponents((prevComponents) => {
      const updatedComponents = [...prevComponents];
      updatedComponents[index].isChecked = !updatedComponents[index].isChecked; // Toggle the checked state

      // Post updated scannedComponents to Figma
      parent.postMessage(
        {
          pluginMessage: {
            type: "UPDATE_SCANNED_COMPONENTS",
            updatedComponents: updatedComponents,
          },
        },
        "*"
      );

      return updatedComponents;
    });
  };

  return (
    <div className={styles.container}>
      <Header>
        {/* Segmented control for selecting by page or by selection */}
        <SegmentedControl value={state} onChange={(value) => setState(value)}>
          <SegmentedControlOption
            value="byPage"
            name="selection-type"
            disabled={scanLoading || swapLoading}
          >
            By page
          </SegmentedControlOption>
          <SegmentedControlOption
            value="bySelection"
            name="selection-type"
            disabled={scanLoading || swapLoading}
          >
            By selection
          </SegmentedControlOption>
        </SegmentedControl>
      </Header>

      {/* Scrollable container for PreviewCards */}
      <Body>
        {swapLoading && (
          <div className={styles.overlay}>
            <Placeholder
              inverse
              imageSrc={TorchieGif}
              imageAlt="Swapping"
              title="Swapping components"
              description="Just a moment, swapping now..."
            />
          </div>
        )}
        {scannedComponents.length > 0 ? (
          <Stack flexDirection="column" gap="4px">
            {scannedComponents.map((component, index) => (
              <AnimatePresence key={index}>
                <motion.div
                  transition={cardAnimation}
                  initial={{ y: 4, opacity: 0.2 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 4, opacity: 0.2 }}
                >
                  <div key={component.index}>
                    <img src={component.oldImage} style={{ height: 32 }} />
                    <img src={component.newImage} style={{ height: 32 }} />
                    <Checkbox
                      id={component.index}
                      type="checkbox"
                      checked={component.isChecked}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            ))}
          </Stack>
        ) : (
          <React.Fragment>
            {nodesScanned ? (
              scanLoading ? (
                <Placeholder
                  imageSrc={TorchieGif}
                  imageAlt="Scanning"
                  title="Scanning"
                  description="Hang tight! Scanning now..."
                />
              ) : !success ? (
                <Placeholder
                  imageSrc={TorchieSurprised}
                  imageAlt="Nothing found"
                  title="Nothing found"
                  description="No Beacon components were found."
                />
              ) : (
                <Placeholder
                  imageSrc={TorchieLove}
                  imageAlt="Success"
                  title="Successful swap"
                  description="All components have been swapped!"
                />
              )
            ) : (
              <Placeholder
                imageSrc={TorchieCool}
                imageAlt="Start your scan"
                title="Start your scan"
                description={`Ready to update? Scan your ${
                  state === "byPage" ? "page" : "selection"
                }.`}
              />
            )}
          </React.Fragment>
        )}
      </Body>

      {/* Button to trigger the component scan */}
      <Footer>
        <Button
          disabled={scanLoading || swapLoading}
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

        {/* Button to trigger swapping the components */}
        <Button
          disabled={
            scanLoading || swapLoading || scannedComponents.length === 0
          }
          variant="primary"
          style={{ width: "100%" }}
          onClick={handleSwapClick} // Trigger the swap when clicked
          before={<RefreshOutlined16 />}
        >
          Get swapped
        </Button>
      </Footer>
    </div>
  );
};

export default App;
