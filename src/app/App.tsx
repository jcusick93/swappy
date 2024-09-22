import * as React from "react";
import styles from "./app.module.scss";
import {Button }from "./components/Button";

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
    <section className={styles.wrap}>
      <Button onClick={handleClick}>Swap styles</Button>

    </section>
  );
};

export default App;
