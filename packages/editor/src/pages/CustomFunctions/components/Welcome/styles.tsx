import styled from "styled-components";

export const CenteredContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 50px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const WelcomeTitle = styled.h1.attrs({ className: "ms-font-su" })`
  line-height: 5.6rem;
  color: ${(props) => props.theme.neutralPrimary};
`;

export const WelcomeSubTitle = styled.h3.attrs({ className: "ms-font-s-plus" })`
  margin-top: 0.7rem;
  line-height: 1.7rem;
  color: ${(props) => props.theme.neutralPrimary};
  max-width: 20rem;
  text-align: center;
`;

export const Separator = styled.hr`
  width: 14.1rem;
  margin-top: 2.4rem;
  margin-bottom: 3.2rem;
  color: ${(props) => props.theme.neutralLight};
`;

export const Instructions = styled.section`
  max-width: 33rem;
  text-align: left;
`;

export const InstructionsDescription = styled.h3.attrs({ className: "ms-font-s-plus" })`
  margin-bottom: 1.9rem;
`;

export const List = styled.ol.attrs({ className: "ms-font-s" })``;

export const ListItem = styled.li`
  margin-bottom: 2.6rem;
`;
export const CodeBlock = styled.div.attrs({ className: "ms-font-xs" })`
  white-space: pre-line;
  background: ${(props) => props.theme.neutralLight};
  padding: 0.6rem;
  margin-top: 0.8rem;
`;
