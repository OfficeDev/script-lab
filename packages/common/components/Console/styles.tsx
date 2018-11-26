import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: 3;
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const NoLogsPlaceholderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.neutralPrimary};

  height: 100%;
  width: 100%;
`;

export const NoLogsPlaceholder = styled.div`
  text-align: center;
  max-width: 90%;
`;

export const RunnerLastUpdatedWrapper = styled.div.attrs({ className: 'ms-font-m' })`
  padding: 0rem 1.6rem;
  height: 2.8rem;
  line-height: 2.8rem;
  background: ${props => props.theme.neutralLighter};
  overflow: hidden;
  overflow-wrap: normal;
`;

export const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem;
  height: 4.8rem;
  background: ${props => props.theme.neutralLight};
  box-sizing: border-box;
`;

export const CheckboxWrapper = styled.div`
  height: 3.8rem;
  background: ${props => props.theme.neutralLight};
  box-sizing: border-box;
  padding: 0.9rem;
`;

export const LogsArea = styled.div`
  height: 100%;
  max-height: inherit;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
`;

export const LogsList = styled.ul``;

export const Log = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 3.2rem;
  padding: 0.9rem;
  padding-left: 1rem;
  font-family: monospace;
  box-sizing: border-box;
  border-top: 0.5px solid ${props => props.theme.neutralLight};
  border-bottom: 0.5px solid ${props => props.theme.neutralLight};
`;

export const LogText = styled.pre`
  word-wrap: break-word;
  font-size: 1.2rem;
  position: absolute;
  left: 3.4rem;
  /* margin-left: 2rem; */
  width: 100%;
`;

export const ClearButton = styled.button`
  width: 2rem;
  height: 2rem;
  background: none;
  border: 0px;
  position: relative;
  margin-right: 1.3rem;
  margin-left: 0.5rem;

  &:hover {
    color: #b22222;
    cursor: pointer;
  }

  &:active {
    color: red;
  }

  &:focus {
    outline: none;
  }
`;
