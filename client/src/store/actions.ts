import { ActionType } from 'typesafe-actions'

import * as solutions from './solutions/actions'
import * as host from './host/actions'
import * as gists from './gists/actions'
import * as samples from './samples/actions'
import * as github from './github/actions'
import * as messageBar from './messageBar/actions'
import * as settings from './settings/actions'

export { solutions }
export { host }
export { gists }
export { samples }
export { messageBar }
export { settings }
export { github }

export default {
  solutions,
  host,
  gists,
  samples,
  github,
  messageBar,
  settings,
}

export type ISolutionsAction = ActionType<typeof solutions>
export type IHostAction = ActionType<typeof host>
export type IGistsAction = ActionType<typeof gists>
export type ISamplesAction = ActionType<typeof samples>
export type IGithubAction = ActionType<typeof github>
export type IMessageBarAction = ActionType<typeof messageBar>
export type ISettingsAction = ActionType<typeof settings>
