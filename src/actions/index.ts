import { ActionType, getType } from 'typesafe-actions'

import * as solutions from './solutions'
import * as files from './files'

export { solutions }
export { files }

export type ISolutionsAction = ActionType<typeof solutions>
export type IFilesAction = ActionType<typeof files>
