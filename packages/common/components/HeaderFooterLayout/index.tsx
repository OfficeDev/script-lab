import React from 'react';
import { Layout, ContentWrapper } from './styles';

export interface IProps {
  header: React.ReactElement<any>;
  footer: React.ReactElement<any>;
  wrapperStyle?: React.CSSProperties;
  children: React.ReactNode;
}

const HeaderFooterLayout = ({ header, footer, wrapperStyle, children }: IProps) => (
  <Layout style={wrapperStyle ? wrapperStyle : {}}>
    {header}
    <ContentWrapper>{children}</ContentWrapper>
    {footer}
  </Layout>
);

export default HeaderFooterLayout;
