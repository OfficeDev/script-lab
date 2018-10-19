import {
  gists,
  messageBar,
  solutions,
  settings,
  IGistsAction,
  IMessageBarAction,
  ISolutionsAction,
  ISettingsAction,
} from '../actions'
import { getType } from 'typesafe-actions'
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar'

export interface IState {
  isVisible: boolean
  style: MessageBarType
  text: string
  link: {
    url: string
    text: string
  } | null
}

const defaultState: IState = {
  isVisible: false,
  style: MessageBarType.info,
  text: '',
  link: null,
}

const messageBarReducer = (
  state: IState = defaultState,
  action: IGistsAction | IMessageBarAction | ISolutionsAction | ISettingsAction,
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
      }

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
      }

    case getType(settings.edit.success):
      return {
        isVisible: action.payload.showMessageBar,
        style: MessageBarType.success,
        text: 'Settings successfully applied.',
        link: null,
      }

    case getType(settings.edit.failure):
      return {
        isVisible: true,
        style: MessageBarType.error,
        text: `Settings ${action.payload}`,
        link: null,
      }

    case getType(messageBar.show):
      return {
        isVisible: true,
        style: action.payload.style,
        text: action.payload.text,
        link: null,
      }

    case getType(messageBar.dismiss):
      return defaultState

    default:
      return state
  }
}

export default messageBarReducer
