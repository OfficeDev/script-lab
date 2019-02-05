import { ActionType } from 'typesafe-actions';

import * as dialog from './dialog/actions';
import * as editor from './editor/actions';
import * as gists from './gists/actions';
import * as github from './github/actions';
import * as host from './host/actions';
import * as messageBar from './messageBar/actions';
import * as misc from './misc/actions';
import * as samples from './samples/actions';
import * as screen from './screen/actions';
import * as settings from './settings/actions';
import * as solutions from './solutions/actions';

export { dialog };
export { editor };
export { gists };
export { github };
export { host };
export { messageBar };
export { misc };
export { samples };
export { screen };
export { settings };
export { solutions };

const all = {
  dialog,
  editor,
  gists,
  github,
  host,
  messageBar,
  misc,
  samples,
  screen,
  settings,
  solutions,
};

export default all;

export type IDialogAction = ActionType<typeof dialog>;
export type IEditorAction = ActionType<typeof editor>;
export type IGistsAction = ActionType<typeof gists>;
export type IGithubAction = ActionType<typeof github>;
export type IHostAction = ActionType<typeof host>;
export type IMessageBarAction = ActionType<typeof messageBar>;
export type IMiscAction = ActionType<typeof misc>;
export type ISamplesAction = ActionType<typeof samples>;
export type IScreenAction = ActionType<typeof screen>;
export type ISettingsAction = ActionType<typeof settings>;
export type ISolutionsAction = ActionType<typeof solutions>;

export type IRootAction = ActionType<typeof all>;
