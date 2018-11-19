import React from 'react';
import { storiesOf } from '@storybook/react';

import { Header } from './';
import { getCommandBarFabricTheme } from '../../../theme';
import { getBoilerplate, getBoilerplateSolution } from '../../../newSolutionData';
import { SCRIPT_FILE_NAME } from '../../../constants';

const voidFunc = () => {};
const solution = getBoilerplate('EXCEL');
const defaultHeaderProps = {
  isRunnableOnThisHost: true,
  isSettingsView: false,
  isCustomFunctionsView: false,
  isLoggedIn: false,
  isLoggingInOrOut: false,
  isNullSolution: false,
  profilePicUrl: null,
  screenWidth: 700,
  commandBarFabricTheme: getCommandBarFabricTheme('EXCEL'),

  login: voidFunc,
  logout: voidFunc,

  showBackstage: voidFunc,
  closeSettings: voidFunc,

  editSolution: (solutionId: string, solution: any) => {},
  deleteSolution: voidFunc,

  createPublicGist: voidFunc,
  createSecretGist: voidFunc,
  updateGist: voidFunc,
  notifyClipboardCopySuccess: voidFunc,
  notifyClipboardCopyFailure: voidFunc,

  navigateToCustomFunctions: voidFunc,

  solution,
  file: solution.files.find(file => file.name === SCRIPT_FILE_NAME)!,
  isDirectScriptExecutionSolution: false,
  runnableFunctions: [],
  directScriptExecutionFunction: (
    solutionId: string,
    fileId: string,
    functionName: string,
  ) => {},
  terminateAllDirectScriptExecutionFunctions: () => {},
  showDialog: (
    title: string,
    subText: string,
    buttons: Array<{
      text: string;
      action: { type: string; payload?: any };
      isPrimary: boolean;
    }>,
  ) => {},
};

storiesOf('IDE|Header', module)
  .add('basic', () => <Header {...defaultHeaderProps} />)
  .add('custom functions view', () => (
    <Header {...{ ...defaultHeaderProps, isCustomFunctionsView: true }} />
  ))
  .add('settings view', () => (
    <Header {...{ ...defaultHeaderProps, isSettingsView: true }} />
  ))
  .add('logging in', () => (
    <Header {...{ ...defaultHeaderProps, isLoggingInOrOut: true }} />
  ));
