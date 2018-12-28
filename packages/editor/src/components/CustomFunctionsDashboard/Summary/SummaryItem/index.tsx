import React from 'react';
import styled from 'styled-components';

import { Icon } from 'office-ui-fabric-react/lib/Icon';

const Wrapper = styled.div`
  position: relative;
  padding: 0rem 1.8rem;

  border-top: 0.5px solid ${props => props.theme.neutralLight};
  border-bottom: 0.5px solid ${props => props.theme.neutralLight};
`;

const FunctionNameWrapper = styled.div`
  display: flex;
  align-items: center;

  min-height: 4.25rem;
  line-height: 4.25rem;
`;

const FunctionName = styled.h4.attrs({ className: 'ms-font-s' })``;

const AdditionalInfo = styled.div.attrs({ className: 'ms-font-xs' })`
  color: red;
  margin-top: 0.8rem;
`;

const AdditionalInfoContainer = styled.div`
  padding: 0rem 2rem 2rem 2.5rem;

  & > ${AdditionalInfo}:first-child {
    margin-top: 0;
  }
`;

const SnippetName = styled.div.attrs({ className: 'ms-font-s' })`
  position: absolute;
  bottom: 0.2rem;
  right: 0.5rem;

  color: ${props => props.theme.neutralSecondaryLight};

  font-variant: small-caps;
  white-space: nowrap;
`;

const SummaryItem = ({
  status,
  snippetName,
  funcName,
  additionalInfo,
}: ICustomFunctionSummaryItem) => {
  const { iconName, color } = {
    ['good']: { iconName: 'Completed', color: '#107C10' },
    ['skipped']: { iconName: 'Warning', color: '#F0C784' },
    ['error']: { iconName: 'ErrorBadge', color: 'red' },
    ['untrusted']: { iconName: 'ReportHacked', color: 'gray' },
  }[status];

  return (
    <Wrapper>
      <FunctionNameWrapper>
        <Icon
          iconName={iconName}
          styles={{
            root: { marginRight: '0.5rem', color },
          }}
        />
        <FunctionName>
          {funcName}
          (...)
        </FunctionName>
      </FunctionNameWrapper>
      {additionalInfo && (
        <AdditionalInfoContainer>
          {additionalInfo.map(info => (
            <AdditionalInfo key={info}>{info}</AdditionalInfo>
          ))}
        </AdditionalInfoContainer>
      )}
      <SnippetName>
        =ScriptLab.
        {snippetName}.{funcName}
        (...)
      </SnippetName>
    </Wrapper>
  );
};

export default SummaryItem;
