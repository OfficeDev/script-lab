import { ActionType } from 'typesafe-actions'

import * as solutions from './solutions'
import * as files from './files'
import * as samples from './samples'

export { solutions }
export { files }
export { samples }

export default {
  solutions,
  files,
  samples,
}

export type ISolutionsAction = ActionType<typeof solutions>
export type IFilesAction = ActionType<typeof files>
export type ISamplesAction = ActionType<typeof samples>
