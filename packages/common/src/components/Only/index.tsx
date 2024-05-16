import React from "react";
export interface IProps {
  when: boolean;
  children: React.ReactNode;
}

export default ({ when, children }: IProps): JSX.Element => (when ? children : null) as JSX.Element;
