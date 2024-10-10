import * as React from "react";

export interface HeaderProps {
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  return <header>{children}</header>;
};
