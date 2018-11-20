import styled from 'styled-components';

export const Layout = styled.div`
  height: 100vh;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

export const ContentWrapper = styled.div`
  z-index: 1000;
  flex: 1;
  height: 100%;

  overflow: hidden;

  background: ${props => props.theme.white};
`;
