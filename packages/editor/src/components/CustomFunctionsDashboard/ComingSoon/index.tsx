import React from 'react';
import {
  CenteredContent,
  Logo,
  ScriptLabTitle,
  CustomFunctionsTitle,
  Seperator,
  Description,
} from './styles';
import { CUSTOM_FUNCTIONS_INFO_URL } from '../../../constants';

const ComingSoon = () => (
  <CenteredContent>
    <Logo />
    <ScriptLabTitle>Script Lab</ScriptLabTitle>
    <CustomFunctionsTitle>Custom Functions</CustomFunctionsTitle>
    <Seperator />
    <Description>
      Currently, Script Lab only supports Custom Functions (Preview) on Windows Desktop on
      the latest Insider builds, and on Office Online.
      <br />
      <br />
      For more info, see{' '}
      <a href={CUSTOM_FUNCTIONS_INFO_URL} target="_blank">
        these instructions
      </a>
      .
    </Description>
  </CenteredContent>
);

export default ComingSoon;
