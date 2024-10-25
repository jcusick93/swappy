import * as React from "react";

export interface StackProps<T extends React.ElementType = "div">
  extends React.HTMLAttributes<T> {
  as?: T; // Prop to specify the element type
  flexDirection?: React.CSSProperties["flexDirection"];
  gap?: "0px" | "4px" | "8px" | "12px";
  display?: "inline-flex" | "flex";
  justifyContent?: React.CSSProperties["justifyContent"];
  alignItems?: React.CSSProperties["alignItems"];
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

// Create a type that extracts the props for the specified element type
type PolymorphicRef<T extends React.ElementType> = T extends React.ElementType
  ? React.ComponentProps<T>
  : never;

export const Stack = <T extends React.ElementType = "div">({
  as: Component = "div", // Default to 'div' if no 'as' prop is provided
  children,
  flexDirection = "row",
  gap = "4px",
  display = "flex",
  justifyContent,
  alignItems,
  style,
  ...rest
}: StackProps<T> & PolymorphicRef<T>) => {
  return (
    <Component
      style={{
        flexDirection,
        gap,
        display,
        justifyContent,
        alignItems,
        ...style,
      }}
      {...(rest as PolymorphicRef<T>)} // Spread the rest props with the correct type
    >
      {children}
    </Component>
  );
};
