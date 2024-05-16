import styled from "styled-components";

export const CustomFunctionsDescription = styled.h4.attrs({ className: "ms-font-m" })`
  margin: 1.3rem 1.7rem 0rem 1.7rem;
`;

export const SummaryItemsContainer = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid ${(props) => props.theme.neutralLight};
  border-bottom: 1px solid ${(props) => props.theme.neutralLight};
`;

export const LoadingContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
