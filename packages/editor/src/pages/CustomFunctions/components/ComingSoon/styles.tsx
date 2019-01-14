import styled from 'styled-components';

export const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

export const Logo = styled.img.attrs({ src: './assets/images/icon-large.svg' })`
  height: 12rem;
  width: 12rem;
`;

export const ScriptLabTitle = styled.h2.attrs({ className: 'ms-font-xxl' })``;

export const CustomFunctionsTitle = styled.h1.attrs({
  className: 'ms-fontSize-su ms-fontWeight-light',
})`
  color: #d83b01;
  margin-top: 2.4rem;
  line-height: 5.6rem;
  max-width: 30rem;
  text-align: center;
`;

export const Seperator = styled.hr`
  width: 11.8rem;
  margin-top: 2.2rem;
  margin-bottom: 2.7rem;
  color: ${props => props.theme.neutralDark};
`;

export const Description = styled.p.attrs({
  className: 'ms-fontSize-m ms-fontWeight-regular',
})`
  max-width: 25rem;
  text-align: center;
  line-height: 1.9rem;
  color: ${props => props.theme.neutralDark};
`;
