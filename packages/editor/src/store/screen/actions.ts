import { createAction } from 'typesafe-actions'

export const updateWidth = createAction('SCREEN_UPDATE_WIDTH', resolve => {
  return (width: number) => resolve(width)
})
