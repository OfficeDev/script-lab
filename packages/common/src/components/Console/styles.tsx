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

export const HeaderWrapper = styled.div`
  background: ${props => props.theme.neutralLight};
  height: 3.2rem;
  display: flex;
  justify-content: space-between;
`;

export const CheckboxWrapper = styled.div`
  flex-grow: 1;
  padding: 0.6rem;
`;

export const LogsArea = styled.div`
  height: 100%;
  max-height: inherit;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
`;

export const LogsList = styled.ul``;

export const LogEntry = styled.li`
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
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 1.2rem;
  margin-left: 1rem;
  width: 100%;
`;

export const ObjectInspectorLogEntry = styled.div<{ backgroundColor: string }>`
  display: flex;
  width: 100%;
  min-height: 3.2rem;
  padding: 0.9rem;
  padding-left: 1rem;
  box-sizing: border-box;
  border-top: 0.5px solid ${props => props.theme.neutralLight};
  border-bottom: 0.5px solid ${props => props.theme.neutralLight};

  & > li {
    margin-left: 1rem;
  }

  & * {
    background: ${props => props.backgroundColor};
  }
`;
