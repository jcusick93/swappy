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
  Accordian,
} from "./components";
import { RefreshOutlined16 } from "./components/Icons/RefreshOutlined16";
import styles from "./app.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import TorchieGif from "./assets/images/happy_torchie.gif";
import TorchieSurprised from "./assets/images/surprised_torchie.png";
import TorchieCool from "./assets/images/cool_torchie.png";
import TorchieLove from "./assets/images/love_torchie.png";
import { PreviewCard } from "./components/Cards/PreviewCard/PreviewCard";

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

  const swapButtonDisabled =
    scanLoading ||
    swapLoading ||
    !scannedComponents.some((component) => component.isChecked);

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
    const handleMessage = (event) => {
      const { pluginMessage } = event.data;
      if (pluginMessage.type === "COMPONENT_IMAGES") {
        // Set scanned components, default all to checked
        setScannedComponents(
          pluginMessage.componentImages.map((component) => ({
            ...component,
            isChecked: true,
          }))
        );
      } else if (pluginMessage.type === "SWAP_COMPLETE") {
        // Remove previously checked components after swap is complete
        setScannedComponents((prev) =>
          prev.filter((_, index) => !previouslyChecked.includes(index))
        );
        setPreviouslyChecked([]);
        setSwapLoading(false);
      } else if (pluginMessage.type === "SCAN_COMPLETE") {
        setTimeout(() => {
          setScanLoading(false);
        }, 1000);
      }
    };

    window.onmessage = handleMessage;

    return () => {
      window.onmessage = null; // Clean up listener on unmount
    };
  }, [previouslyChecked]);

  // Group scanned components by groupName and sort alphabetically
  const groupedComponents = scannedComponents.reduce((acc, component) => {
    if (!acc[component.groupName]) {
      acc[component.groupName] = [];
    }
    acc[component.groupName].push(component);
    return acc;
  }, {});

  // Sort the grouped components by groupName
  const sortedGroupNames = Object.keys(groupedComponents).sort();

  // Create a new object that preserves the sorted order
  const sortedGroupedComponents = sortedGroupNames.reduce((acc, groupName) => {
    acc[groupName] = groupedComponents[groupName];
    return acc;
  }, {});

  const handleScanClick = () => {
    setScanLoading(true);
    setNodesScanned(true);
    setScannedComponents([]);
    setSuccess(false);

    setTimeout(() => {
      parent.postMessage(
        {
          pluginMessage: {
            type: "SCAN_COMPONENTS",
            scanType: state,
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

    setPreviouslyChecked(currentlyCheckedIndexes);
    setSwapLoading(true);
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
          ),
        },
      },
      "*"
    );
  };

  const handleCheckboxChange = (index) => {
    // Update the checked state of the specific component
    setScannedComponents((prevComponents) => {
      const updatedComponents = [...prevComponents];
      updatedComponents[index].isChecked = !updatedComponents[index].isChecked;

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
        <SegmentedControl value={state} onChange={setState}>
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
            {Object.keys(sortedGroupedComponents).map((groupName) => (
              <Accordian key={groupName} title={groupName}>
                {sortedGroupedComponents[groupName].map((component, index) => (
                  <AnimatePresence key={index}>
                    <motion.div
                      transition={cardAnimation}
                      initial={{ y: 4, opacity: 0.2 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 4, opacity: 0.2 }}
                    >
                      <PreviewCard
                        id={component.index}
                        oldImage={component.oldImage}
                        newImage={component.newImage}
                        key={component.index}
                        checked={component.isChecked}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </motion.div>
                  </AnimatePresence>
                ))}
              </Accordian>
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
          onClick={handleScanClick}
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
          disabled={swapButtonDisabled}
          variant="primary"
          style={{ width: "100%" }}
          onClick={handleSwapClick}
          before={<RefreshOutlined16 />}
        >
          Get swapped
        </Button>
      </Footer>
    </div>
  );
};

export default App;
