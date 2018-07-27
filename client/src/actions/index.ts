import { ActionType } from 'typesafe-actions'

import * as solutions from './solutions'
import * as files from './files'
import * as samples from './samples'
import * as gists from './gists'
import * as github from './github'

export { solutions }
export { files }
export { samples }
export { gists }
export { github }

export default {
  solutions,
  files,
  samples,
  gists,
  github,
}

export type ISolutionsAction = ActionType<typeof solutions>
export type IFilesAction = ActionType<typeof files>
export type ISamplesAction = ActionType<typeof samples>
export type IGistsAction = ActionType<typeof gists>
export type IGithubAction = ActionType<typeof github>
