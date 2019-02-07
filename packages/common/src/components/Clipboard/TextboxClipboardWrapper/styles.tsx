import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  border: 1px gray solid;
  border-radius: 4px;

  & > :nth-child(1) {
    flex: 1;
  }
`;
