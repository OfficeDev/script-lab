import React from 'react'
import { mount } from 'enzyme'

import Header, { IHeader } from '.'
import { getBoilerplate } from '../../newSolutionData'
import { ITheme as IFabricTheme } from '@uifabric/styling'

const normalExample = getBoilerplate('EXCEL')

const actionProps = {
  showBackstage: () => {},
  editSolution: (
    solutionId: string,
    solution: Partial<IEditableSolutionProperties>,
  ) => {},
  login: () => {},
  logout: () => {},
  deleteSolution: () => {},
  createPublicGist: () => {},
  createSecretGist: () => {},
  updateGist: () => {},
  notifyClipboardCopySuccess: () => {},
  notifyClipboardCopyFailure: () => {},
}

describe('Header should render properly', () => {
  it('most basic', () => {
    const solution = normalExample
    const headerProps: IHeader = {
      solution,
      isLoggedIn: true,
      isWeb: false,
      isSettingsView: false,
      profilePicUrl: undefined,
      headerFabricTheme: {} as IFabricTheme,
      ...actionProps,
    }
    const header = mount(<Header {...headerProps} />)

    const expectedTopLevelButtonTexts = [
      '',
      'Blank Snippet',
      'Run',
      'Share',
      'Delete',
      '',
    ]

    expect(header.find('CommandBarButton').map(btn => btn.props().text)).toEqual(
      expectedTopLevelButtonTexts,
    )
  })
})
