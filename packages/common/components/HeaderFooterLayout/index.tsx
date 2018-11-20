import React from 'react';
import { Layout, ContentWrapper } from './styles';

export interface IProps {
  header: React.ReactElement<any>;
  footer: React.ReactElement<any>;
  children: React.ReactNode;
}

const HeaderFooterLayout = ({ header, footer, children }: IProps) => (
  <Layout>
    {header}
    <ContentWrapper>{children}</ContentWrapper>
    {footer}
  </Layout>
);

export default HeaderFooterLayout;
