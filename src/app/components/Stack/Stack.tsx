import * as React from "react";

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  flexDirection?: React.CSSProperties["flexDirection"];
  gap?: "0px" | "4px" | "8px" | "12px";
  display?: "inline-flex" | "flex";
  justifyContent?: React.CSSProperties["justifyContent"];
  alignItems?: React.CSSProperties["alignItems"];
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Stack: React.FC<StackProps> = ({
  children,
  flexDirection = "row",
  gap = "4px",
  display = "flex",
  justifyContent,
  alignItems,
  style,
  ...rest
}) => {
  return (
    <div
      style={{
        flexDirection,
        gap,
        display,
        justifyContent,
        alignItems,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
