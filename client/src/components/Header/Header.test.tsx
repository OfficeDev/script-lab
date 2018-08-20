import React from 'react'
import { mount } from 'enzyme'

import { Header, IHeader } from '.'
import { getBoilerplate } from '../../newSolutionData'
import { ITheme as IFabricTheme } from '@uifabric/styling'
import { getHeaderFabricTheme } from '../../theme'
import { ICommandBarProps } from 'office-ui-fabric-react/lib/CommandBar'

const actionProps = {
  showBackstage: () => {},
  editSolution: (
    solutionId: string,
    solution: Partial<IEditableSolutionProperties>,
  ) => {},
  login: () => {},
  logout: () => {},
  goBack: () => {},
  deleteSolution: () => {},
  createPublicGist: () => {},
  createSecretGist: () => {},
  updateGist: () => {},
  notifyClipboardCopySuccess: () => {},
  notifyClipboardCopyFailure: () => {},
}

describe('Header should render properly in basic case', () => {
  const normalExample = getBoilerplate('EXCEL')

  const solution = normalExample
  const headerProps: IHeader = {
    solution,
    isLoggedIn: true,
    isRunnableOnThisHost: true,
    isSettingsView: false,
    profilePicUrl: undefined,
    headerFabricTheme: getHeaderFabricTheme('WEB') as IFabricTheme,
    ...actionProps,
  }

  const header = mount(<Header {...headerProps} />)
  const commandBarProps: ICommandBarProps = header.find('CommandBarBase').props()

  it('should render the profile pic item', () => {
    expect(commandBarProps.farItems!.length).toEqual(1)
    expect(commandBarProps.farItems![0].key).toEqual('account')
  })

  it('should render the proper items in the header', () => {
    expect(commandBarProps.items.length).toEqual(5)
    expect(commandBarProps.items.map(({ key }) => key)).toEqual([
      'nav',
      'solution-name',
      'run',
      'share',
      'delete',
    ])
  })

  it('should show the proper share buttons', () => {
    const shareSubMenuItems = commandBarProps.items.filter(
      item => item.key === 'share',
    )[0].subMenuProps!.items
    expect(shareSubMenuItems.length).toEqual(3)
    expect(shareSubMenuItems.map(item => item.key)).toEqual([
      'new-public-gist',
      'new-secret-gist',
      'export-to-clipboard',
    ])
  })
})

describe("Header shouldn't show run button if isn't runnable", () => {
  const normalExample = getBoilerplate('EXCEL')

  const solution = normalExample
  const headerProps: IHeader = {
    solution,
    isLoggedIn: true,
    isRunnableOnThisHost: false,
    isSettingsView: false,
    profilePicUrl: undefined,
    headerFabricTheme: getHeaderFabricTheme('WEB') as IFabricTheme,
    ...actionProps,
  }

  const header = mount(<Header {...headerProps} />)
  const commandBarProps: ICommandBarProps = header.find('CommandBarBase').props()

  it('should render the proper items in the header', () => {
    expect(commandBarProps.items.length).toEqual(4)
    expect(commandBarProps.items.map(({ key }) => key)).toEqual([
      'nav',
      'solution-name',
      'share',
      'delete',
    ])
  })
})
