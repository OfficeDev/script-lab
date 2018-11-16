import React from 'react';
import { mount } from 'enzyme';

import { Header, IProps } from '.';
import { getBoilerplate } from '../../../newSolutionData';
import { ITheme as IFabricTheme } from 'office-ui-fabric-react/lib/Styling';
import { getCommandBarFabricTheme } from '../../../theme';
import { ICommandBarProps } from 'office-ui-fabric-react/lib/CommandBar';
import { SCRIPT_FILE_NAME } from '../../../constants';

const host = 'EXCEL';

const actionProps = {
  showBackstage: () => {},
  editSolution: (
    solutionId: string,
    solution: Partial<IEditableSolutionProperties>,
  ) => {},
  login: () => {},
  logout: () => {},
  closeSettings: () => {},
  deleteSolution: () => {},
  createPublicGist: () => {},
  createSecretGist: () => {},
  updateGist: () => {},
  notifyClipboardCopySuccess: () => {},
  notifyClipboardCopyFailure: () => {},
  navigateToCustomFunctions: () => {},
  navigateToRun: () => {},
  showTrustError: () => {},
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
      action: { type: string; payload: any };
      isPrimary: boolean;
    }>,
  ) => {},
};

describe('Header should render properly in basic case', () => {
  const normalExample = getBoilerplate(host);

  const solution = normalExample;
  const headerProps = {
    solution,
    file: solution.files.find(file => file.name === SCRIPT_FILE_NAME)!,
    isLoggedIn: true,
    isLoggingInOrOut: false,
    isRunnableOnThisHost: true,
    isSettingsView: false,
    isCustomFunctionsView: false,
    isNullSolution: false,
    isDirectScriptExecutionSolution: false,
    runnableFunctions: [],
    profilePicUrl: null,
    screenWidth: 700,
    commandBarFabricTheme: getCommandBarFabricTheme(host) as IFabricTheme,
    ...actionProps,
  };

  const header = mount(<Header {...headerProps} />);
  const commandBarProps: ICommandBarProps = header.find('CommandBarBase').props();

  it('should render the profile pic item', () => {
    expect(commandBarProps.farItems!.length).toEqual(1);
    expect(commandBarProps.farItems![0].key).toEqual('account');
  });

  it('should render the proper items in the header', () => {
    expect(commandBarProps.items.length).toEqual(5);
    expect(commandBarProps.items.map(({ key }) => key)).toEqual([
      'nav',
      'solution-name',
      'run',
      'delete',
      'share',
    ]);
  });

  it('should show the proper share buttons', () => {
    const shareSubMenuItems = commandBarProps.items.filter(
      item => item.key === 'share',
    )[0].subMenuProps!.items;
    expect(shareSubMenuItems.length).toEqual(3);
    expect(shareSubMenuItems.map(item => item.key)).toEqual([
      'new-public-gist',
      'new-secret-gist',
      'export-to-clipboard',
    ]);
  });
});

describe("Header shouldn't show run button if isn't runnable", () => {
  const normalExample = getBoilerplate(host);

  const solution = normalExample;
  const headerProps = {
    solution,
    file: solution.files.find(file => file.name === SCRIPT_FILE_NAME)!,
    isLoggedIn: true,
    isLoggingInOrOut: false,
    isRunnableOnThisHost: false,
    isSettingsView: false,
    isCustomFunctionsView: false,
    isNullSolution: false,
    isDirectScriptExecutionSolution: false,
    runnableFunctions: [],
    profilePicUrl: null,
    screenWidth: 800,
    commandBarFabricTheme: getCommandBarFabricTheme(host) as IFabricTheme,
    ...actionProps,
  };

  const header = mount(<Header {...headerProps} />);
  const commandBarProps: ICommandBarProps = header.find('CommandBarBase').props();

  it('should render the proper items in the header', () => {
    expect(commandBarProps.items.length).toEqual(4);
    expect(commandBarProps.items.map(({ key }) => key)).toEqual([
      'nav',
      'solution-name',
      'delete',
      'share',
    ]);
  });
});
