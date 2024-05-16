import styled from "styled-components";

export const Wrapper = styled.div`
  flex: 1;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const NoLogsPlaceholderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.neutralPrimary};

  height: 100%;
  width: 100%;
`;

export const NoLogsPlaceholder = styled.div`
  text-align: center;
  max-width: 90%;
`;
