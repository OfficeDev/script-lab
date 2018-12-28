import React from 'react';
import styled from 'styled-components';

export const BackstageWrapper = styled.div`
  display: flex;
  flex-wrap: no-wrap;

  position: absolute;
  top: 0;
  z-index: 10000000; /* 10 million to beat Fabric dialogs 1 million */
  background-color: ${props => props.theme.white};
  height: 100vh;
  width: 100%;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

export const ContentWrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  font-size: 1.6rem;
  overflow-y: auto;
`;

export const ContentTitle = styled.h1.attrs({ className: 'ms-font-xxl' })`
  margin-bottom: 2rem;
`;

export const ContentDescription = styled.h2.attrs({ className: 'ms-font-l' })`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const ContentContainer = styled.div`
  flex: 1;
  position: relative;
  overflow-y: auto;
`;

export const LoadingContainer = styled.div`
  position: absolute;

  background-color: rgba(0, 0, 0, 0.35);

  top: 0;
  left: 0;

  height: 100vh;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;
