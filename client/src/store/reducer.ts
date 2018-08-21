import { combineReducers } from 'redux'
import { RouterState } from 'connected-react-router'

// reducers
import github, { IState as IGithubState } from './github/reducer'
import messageBar, { IState as IMessageBarState } from './messageBar/reducer'
import settings, { IState as ISettingsState } from './settings/reducer'
import solutions, { IState as ISolutionsState } from './solutions/reducer'
import gists, { IState as IGistsState } from './gists/reducer'
import host, { IState as IHostState } from './host/reducer'
import samples, { IState as ISamplesState } from './samples/reducer'

export interface IState {
  github: IGithubState
  messageBar: IMessageBarState
  settings: ISettingsState
  solutions: ISolutionsState
  gists: IGistsState
  host: IHostState
  samples: ISamplesState
  router: RouterState // from connected-react-router
}

const root = combineReducers({
  github,
  messageBar,
  settings,
  solutions,
  gists,
  host,
  samples,
})

export default root
