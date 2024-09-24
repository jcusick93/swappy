import * as React from "react";

import { Button } from "./components/Button/Button/Button";
import { RefreshOutlined16 } from "./components/Icons/RefreshOutlined16";

const App = () => {
  const handleClick = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "SWAP_BUTTONS",
        },
      },
      "*"
    );
  };

  return (
    <div
      style={{
        width: "100%",
        padding: 16,
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
  );
};

export default App;
