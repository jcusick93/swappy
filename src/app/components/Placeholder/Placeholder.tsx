import * as React from "react";
import { Stack } from "../Stack/Stack";

export interface PlaceholderProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({
  imageSrc,
  imageAlt,
  title,
  description,
}) => {
  return (
    <Stack
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="4px"
      style={{ height: "100%", width: "100%", textAlign: "center" }}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        style={{ height: 96, objectFit: "contain" }}
      />
      <h1>{title}</h1>
      <span>{description}</span>
    </Stack>
  );
};
