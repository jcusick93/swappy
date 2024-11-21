import * as React from "react";
import Lottie from "lottie-react";
import SwappyJumping from "../../assets/images/swappyJumping.json";

export const Loader = () => {
  return (
    <Lottie animationData={SwappyJumping} loop={true} style={{ height: 120 }} />
  );
};
