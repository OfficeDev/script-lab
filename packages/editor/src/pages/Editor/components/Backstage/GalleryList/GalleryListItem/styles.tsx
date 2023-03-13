import styled from 'styled-components';

export const Wrapper = styled.article.attrs({ className: 'ms-font-m' })`
  padding: 1rem 1.5rem;
  box-sizing: border-box;
  user-select: none;

  &:hover,
  &:focus {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.white};
    cursor: pointer;
  }
  &:focus {
    outline-color: ${props => props.theme.primary};
  }
`;

export const ActiveWrapper = styled(Wrapper as any)`
  background-color: ${props => props.theme.primaryDarker};
  color: ${props => props.theme.white};
`;

export const Title = styled.div``;

export const Description = styled.div`
  opacity: 0.75;
`;
