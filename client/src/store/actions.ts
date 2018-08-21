import { ActionType } from 'typesafe-actions'

import * as gists from './gists/actions'
import * as github from './github/actions'
import * as host from './host/actions'
import * as messageBar from './messageBar/actions'
import * as misc from './misc/actions'
import * as samples from './samples/actions'
import * as settings from './settings/actions'
import * as solutions from './solutions/actions'

export { gists }
export { github }
export { host }
export { messageBar }
export { misc }
export { samples }
export { settings }
export { solutions }

export default {
  gists,
  github,
  host,
  messageBar,
  misc,
  samples,
  settings,
  solutions,
}

export type IGistsAction = ActionType<typeof gists>
export type IGithubAction = ActionType<typeof github>
export type IHostAction = ActionType<typeof host>
export type IMessageBarAction = ActionType<typeof messageBar>
export type IMiscAction = ActionType<typeof misc>
export type ISamplesAction = ActionType<typeof samples>
export type ISettingsAction = ActionType<typeof settings>
export type ISolutionsAction = ActionType<typeof solutions>
