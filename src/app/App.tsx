import React, { useState, useEffect } from "react";
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
  IconButton,
  Drawer,
  Tooltip,
} from "./components";
import { RefreshOutlined16 } from "./components/Icons/RefreshOutlined16";
import { PreviewCard } from "./components/Cards/PreviewCard/PreviewCard";
import { motion, AnimatePresence } from "framer-motion";
import SwappyJump from "./assets/images/swappy-jump.gif";
import SwappyDefault from "./assets/images/swappy-default.png";
import SwappySad from "./assets/images/swappy-sad.png";
import SwappyLove from "./assets/images/swappy-love.png";

import styles from "./app.module.scss";
import { SettingsOutlined16 } from "./components/Icons/SettingsOutlined16";
import { Switch } from "./components/Switch/Switch";

const buttonLabelTransition = {
  type: "tween",
  ease: [0.05, 0.7, 0.1, 1],
  duration: 0.4,
};
const cardAnimation = {
  type: "tween",
  ease: [0.05, 0.7, 0.1, 1],
  duration: 0.4,
};

const App = () => {
  // The selection state of the segmented control, byPage as a default
  const [state, setState] = useState("byPage");
  // The array of scanned component
  const [scannedComponents, setScannedComponents] = useState([]);
  // Sets the swapLoading state to allow for animations
  const [swapLoading, setSwapLoading] = useState(false);
  // Sets the scanLoading state for the animations
  const [scanLoading, setScanLoading] = useState(false);
  const [nodesScanned, setNodesScanned] = useState(false);
  // Sets the sucess state to show a success screen
  const [success, setSuccess] = useState(false);
  // Drawer states
  const [openDrawer, setOpenDrawer] = React.useState(false);
  // Reset overrides state
  const [resetOverrides, setResetOverrides] = React.useState(true);

  const swapButtonDisabled =
    scanLoading ||
    swapLoading ||
    !scannedComponents.some(({ isChecked }) => isChecked);

  useEffect(() => {
    const handleMessage = (event) => {
      const { pluginMessage } = event.data;

      switch (pluginMessage.type) {
        case "COMPONENT_IMAGES":
          setScannedComponents(
            pluginMessage.componentImages.map((c) => ({
              ...c,
              isChecked: true,
            }))
          );
          break;
        case "SWAP_COMPLETE":
          setScannedComponents((prev) =>
            prev.filter(({ isChecked }) => !isChecked)
          );
          setSwapLoading(false);
          break;
        case "SCAN_COMPLETE":
          setTimeout(() => setScanLoading(false), 1000);
          break;
        case "RESET_OVERRIDES_STATUS": // New case to handle reset overrides status
          setResetOverrides(pluginMessage.value); // Set the state with the retrieved value
          break;
        default:
          break;
      }
    };

    window.onmessage = handleMessage;

    // Request the resetOverrides status when the component mounts
    parent.postMessage({ pluginMessage: { type: "GET_RESET_OVERRIDES" } }, "*");

    return () => (window.onmessage = null);
  }, []);

  const groupedComponents = scannedComponents.reduce((acc, c) => {
    if (!acc[c.groupName]) acc[c.groupName] = [];
    acc[c.groupName].push(c);
    return acc;
  }, {});

  const sortedGroupNames = Object.keys(groupedComponents).sort();

  const handleScanClick = () => {
    setScanLoading(true);
    setNodesScanned(true);
    setScannedComponents([]);
    setSuccess(false);

    setTimeout(() => {
      parent.postMessage(
        { pluginMessage: { type: "SCAN_COMPONENTS", scanType: state } },
        "*"
      );
    }, 400);
  };

  const handleSwapClick = () => {
    setSwapLoading(true);
    setSuccess(true);

    parent.postMessage(
      {
        pluginMessage: {
          type: "SWAP_COMPONENTS",
          checkedStates: scannedComponents.map((c) => c.isChecked),
        },
      },
      "*"
    );
  };

  const handleResetOverridesClick = () => {
    setResetOverrides((prev) => {
      const newValue = !prev; // Toggle the value
      parent.postMessage(
        {
          pluginMessage: {
            type: "RESET_OVERRIDES",
            value: newValue, // Send the new value
          },
        },
        "*"
      );
      return newValue; // Return the new value to update the state
    });
  };

  const handleCheckboxChange = (id) => {
    setScannedComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isChecked: !c.isChecked } : c))
    );

    parent.postMessage(
      {
        pluginMessage: {
          type: "UPDATE_SCANNED_COMPONENTS",
          updatedComponents: scannedComponents,
        },
      },
      "*"
    );
  };

  return (
    <div className={styles.container}>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        title="Settings"
      >
        <Stack flexDirection="column" gap="8px">
          <Switch
            label="Reset overrides"
            id="overrides"
            checked={resetOverrides}
            onChange={handleResetOverridesClick}
          />
        </Stack>
      </Drawer>
      <Header>
        <SegmentedControl value={state} onChange={setState}>
          <SegmentedControlOption
            value="byPage"
            disabled={scanLoading || swapLoading}
          >
            By page
          </SegmentedControlOption>
          <SegmentedControlOption
            value="bySelection"
            disabled={scanLoading || swapLoading}
          >
            By selection
          </SegmentedControlOption>
        </SegmentedControl>
        <Tooltip label="Settings" position="left">
          <IconButton
            label="Settings"
            icon={<SettingsOutlined16 />}
            disabled={scanLoading || swapLoading}
            onClick={() => setOpenDrawer(true)}
          />
        </Tooltip>
      </Header>

      <Body>
        {swapLoading && (
          <div className={styles.overlay}>
            <Placeholder
              inverse
              imageSrc={SwappyJump}
              imageAlt="Swapping"
              title="Swapping components"
              description="Just a moment, swapping now..."
            />
          </div>
        )}

        {scannedComponents.length > 0 ? (
          <AnimatePresence>
            <motion.div
              transition={cardAnimation}
              initial={{ y: 4, opacity: 0.2 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 4, opacity: 0.2 }}
            >
              {sortedGroupNames.map((groupName) => (
                <Accordian
                  key={groupName}
                  title={groupName}
                  count={`(${groupedComponents[groupName].length})`}
                >
                  <Stack flexDirection="column" gap="4px">
                    {groupedComponents[groupName].map((component) => (
                      <PreviewCard
                        key={component.id}
                        id={component.id}
                        oldImage={component.oldImage}
                        newImage={component.newImage}
                        checked={component.isChecked}
                        onChange={() => handleCheckboxChange(component.id)}
                      />
                    ))}
                  </Stack>
                </Accordian>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <Placeholder
            imageSrc={
              nodesScanned
                ? scanLoading
                  ? SwappyJump
                  : success
                  ? SwappyLove
                  : SwappySad
                : SwappyDefault
            }
            imageAlt={
              nodesScanned
                ? scanLoading
                  ? "Scanning"
                  : success
                  ? "Successful swap"
                  : "Nothing found"
                : "Start your scan"
            }
            title={
              nodesScanned
                ? scanLoading
                  ? "Scanning"
                  : success
                  ? "Successful swap"
                  : "Nothing found"
                : "Start your scan"
            }
            description={
              nodesScanned
                ? scanLoading
                  ? "Hang tight! Scanning now..."
                  : success
                  ? "All components have been swapped!"
                  : "No Beacon components were found."
                : `Ready to update? Scan your ${
                    state === "byPage" ? "page" : "selection"
                  }.`
            }
          />
        )}
      </Body>

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
