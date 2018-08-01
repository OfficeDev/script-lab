import { combineReducers } from 'redux'
import { gists, messageBar, solutions } from '../actions'
import { getType } from 'typesafe-actions'
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar'

const isVisible = (state = false, action) => {
  switch (action.type) {
    case getType(gists.create.success):
    case getType(gists.update.success):
    case getType(solutions.remove):
      return true
    case getType(messageBar.dismiss):
      return false
    default:
      return state
  }
}

const style = (state = MessageBarType.info, action) => {
  switch (action.type) {
    case getType(gists.create.success):
    case getType(gists.update.success):
      return MessageBarType.success
    case getType(solutions.remove):
      return MessageBarType.info
    default:
      return state
  }
}

const text = (state = '', action) => {
  switch (action.type) {
    case getType(gists.create.success):
      return `Your gist has been published at https://gist.github.com/${
        action.payload.gist.id
      }.`
    case getType(gists.update.success):
      return `Your gist has been updated at https://gist.github.com/${
        action.payload.gist.id
      }.`
    case getType(solutions.remove):
      return `The snippet '${action.payload.name}' has been deleted.`
    default:
      return state
  }
}

const link = (state = null, action) => {
  switch (action.type) {
    case getType(gists.create.success):
    case getType(gists.update.success):
      return {
        text: 'View on GitHub',
        url: `https://gist.github.com/${action.payload.gist.id}`,
      }
    default:
      return state
  }
}

export default combineReducers({
  isVisible,
  style,
  text,
  link,
})

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
