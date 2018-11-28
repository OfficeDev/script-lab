import {
  customFunctions,
  gists,
  messageBar,
  editor,
  solutions,
  settings,
  ICustomFunctionsAction,
  IGistsAction,
  IMessageBarAction,
  ISolutionsAction,
  ISettingsAction,
  IEditorAction,
} from '../actions';
import { getType } from 'typesafe-actions';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export interface IState {
  isVisible: boolean;
  style: MessageBarType;
  text: string;
  link: {
    url: string;
    text: string;
  } | null;
  button?: {
    text: string;
    action: { type: string; payload: any };
  };
}

export interface IShowMessageBarParams {
  style?: MessageBarType;
  text: string;
  link?: {
    url: string;
    text: string;
  };
  button?: {
    text: string;
    action: { type: string; payload: any };
  };
}

const defaultState: IState = {
  isVisible: false,
  style: MessageBarType.info,
  text: '',
  link: null,
};

const messageBarReducer = (
  state: IState = defaultState,
  action:
    | IGistsAction
    | IMessageBarAction
    | ISolutionsAction
    | ISettingsAction
    | IEditorAction
    | ICustomFunctionsAction,
): IState => {
  switch (action.type) {
    case getType(gists.create.success):
      return {
        isVisible: true,
        style: MessageBarType.success,
        text: `Your gist has been published at https://gist.github.com/${
          action.payload.gist.id
        }.`,
        link: {
          text: 'View on GitHub',
          url: `https://gist.github.com/${action.payload.gist.id}`,
        },
      };

    case getType(gists.update.failure):
      return {
        isVisible: true,
        style: MessageBarType.error,
        text: `Error in updating gist: ${action.payload}`,
        link: null,
      };

    case getType(gists.update.success):
      return {
        isVisible: true,
        style: MessageBarType.success,
        text: `Your gist has been updated at https://gist.github.com/${
          action.payload.gist.id
        }.`,
        link: {
          text: 'View on GitHub',
          url: `https://gist.github.com/${action.payload.gist.id}`,
        },
      };

    case getType(settings.edit.failure):
      return {
        isVisible: true,
        style: MessageBarType.error,
        text: `Settings ${action.payload}`,
        link: null,
      };

    case getType(gists.importSnippet.failure):
      return {
        isVisible: true,
        style: MessageBarType.error,
        text: `${action.payload}`,
        link: null,
      };

    case getType(customFunctions.fetchMetadata.failure):
      return {
        isVisible: true,
        style: MessageBarType.error,
        text: `Error: Failed to parse custom function metadata because '${
          action.payload.message
        }'.`,
        link: null,
      };

    case getType(messageBar.show):
      return action.payload;

    case getType(editor.newSolutionOpened):
      if (action.payload.options.isUntrusted) {
        return {
          isVisible: true,
          style: MessageBarType.warning,
          text: 'Would you like to trust this snippet?',
          link: null,
          button: {
            text: 'Trust',
            action: solutions.updateOptions({
              solution: action.payload,
              options: { isUntrusted: false },
            }),
          },
        };
      } else {
        return defaultState;
      }

    case getType(editor.openFile):
    case getType(settings.edit.success):
    case getType(messageBar.dismiss):
      return defaultState;

    default:
      return state;
  }
};

export default messageBarReducer;
