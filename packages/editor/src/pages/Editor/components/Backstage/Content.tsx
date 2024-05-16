import React from "react";
import { ContentWrapper, ContentTitle, ContentDescription } from "./styles";

export interface IProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default ({ title, description, children }: IProps) => (
  <ContentWrapper>
    <ContentTitle>{title}</ContentTitle>
    <ContentDescription>{description}</ContentDescription>
    {children}
  </ContentWrapper>
);
