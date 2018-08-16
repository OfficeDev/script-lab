import { gists, messageBar, solutions, settings } from '../actions'
import { getType } from 'typesafe-actions'
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar'

export interface IMessageBarState {
  isVisible: boolean
  style: MessageBarType
  text: string
  link: {
    url: string
    text: string
  } | null
}

const defaultState: IMessageBarState = {
  isVisible: false,
  style: MessageBarType.info,
  text: '',
  link: null,
}

const messageBarReducer = (state: IMessageBarState = defaultState, action) => {
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
    case getType(solutions.remove):
      return {
        isVisible: true,
        style: MessageBarType.info,
        text: `The snippet '${action.payload.name}' has been deleted.`,
        link: null,
      }
    case getType(settings.edit.success):
      return {
        isVisible: true,
        style: MessageBarType.info,
        text: 'Settings successfully applied.',
        link: null,
      }

    case getType(settings.edit.failure):
      return {
        isVisible: true,
        style: MessageBarType.error,
        text: `Error in settings. ${action.payload}`,
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

// TODO: maybe remove
// selectors
const getVisibility = (state): boolean => state.isVisible
const getStyle = (state): MessageBarType => state.style
const getText = (state): string => state.text
const getLink = (state): string | null => state.link

export const selectors = {
  getVisibility,
  getStyle,
  getText,
  getLink,
}
