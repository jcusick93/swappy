import * as React from "react";
import { Stack } from "../Stack/Stack";

export interface PlaceholderProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  inverse?: boolean;
}

export const Placeholder: React.FC<PlaceholderProps> = ({
  imageSrc,
  imageAlt,
  title,
  description,
  inverse,
}) => {
  return (
    <Stack
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="12px"
      style={{ height: "100%", width: "100%", textAlign: "center" }}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        style={{ width: 120, objectFit: "contain" }}
      />

      <Stack flexDirection="column" gap="4px" style={{ maxWidth: 280 }}>
        <h1 style={{ color: inverse ? "white" : "var(--color-text-high" }}>
          {title}
        </h1>
        <span
          style={{
            color: inverse ? "white" : "var(--color-text-low",
          }}
        >
          {description}
        </span>
      </Stack>
    </Stack>
  );
};
