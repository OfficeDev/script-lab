import { combineReducers } from 'redux'
import { RouterState } from 'connected-react-router'

// reducers
import customFunctions, { IState as ICFState } from './customFunctions/reducer'
import defaultRun, { IState as IDefaultRunState } from './defaultRun/reducer'
import editor, { IState as IEditorState } from './editor/reducer'
import github, { IState as IGithubState } from './github/reducer'
import messageBar, { IState as IMessageBarState } from './messageBar/reducer'
import settings, { IState as ISettingsState } from './settings/reducer'
import solutions, { IState as ISolutionsState } from './solutions/reducer'
import gists, { IState as IGistsState } from './gists/reducer'
import host, { IState as IHostState } from './host/reducer'
import samples, { IState as ISamplesState } from './samples/reducer'
import screen, { IState as IScreenState } from './screen/reducer'

export interface IState {
  customFunctions: ICFState
  defaultRun: IDefaultRunState
  editor: IEditorState
  github: IGithubState
  messageBar: IMessageBarState
  settings: ISettingsState
  solutions: ISolutionsState
  gists: IGistsState
  host: IHostState
  samples: ISamplesState
  screen: IScreenState
  router: RouterState // from connected-react-router
}

const root = combineReducers({
  customFunctions,
  defaultRun,
  editor,
  github,
  messageBar,
  settings,
  solutions,
  gists,
  host,
  samples,
  screen,
})

export default root
