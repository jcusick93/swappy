import * as React from "react";

import { Button } from "./components/Button";

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
      <h1>Total components swapped: </h1>
      <Button onClick={handleClick}>Swap styles</Button>
    </div>
  );
};

export default App;
