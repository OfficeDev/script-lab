import React from 'react'
import { mount } from 'enzyme'

import Header, { IHeader } from './index'
import { getBoilerplate } from '../../newSolutionData'
import { ITheme as IFabricTheme } from '../../../node_modules/@uifabric/styling'

const normalExample = getBoilerplate()

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
}

describe('Header should render properly', () => {
  it('most basic', () => {
    const { solution, files } = normalExample
    const headerProps: IHeader = {
      solution,
      isLoggedIn: true,
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
