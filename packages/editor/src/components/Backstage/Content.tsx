import React from 'react';
import { ContentWrapper, ContentTitle, ContentDescription } from './styles';

export default ({ title, description, children }) => (
  <ContentWrapper>
    <ContentTitle>{title}</ContentTitle>
    <ContentDescription>{description}</ContentDescription>
    {children}
  </ContentWrapper>
);
