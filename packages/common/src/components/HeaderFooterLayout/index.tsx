import React from "react";
import { Layout, ContentWrapper } from "./styles";

export interface IProps {
  header: React.ReactElement<any>;
  footer: React.ReactElement<any>;
  fullscreen?: boolean;
  wrapperStyle?: React.CSSProperties;
  children: React.ReactNode;
}

const HeaderFooterLayout = ({
  header,
  footer,
  wrapperStyle = {},
  fullscreen,
  children,
}: IProps) => {
  const fullscreenStyles = fullscreen ? { height: "100vh" } : {};
  const style = { ...wrapperStyle, ...fullscreenStyles };

  return (
    <Layout style={style}>
      {header}
      <ContentWrapper>{children}</ContentWrapper>
      {footer}
    </Layout>
  );
};

export default HeaderFooterLayout;
