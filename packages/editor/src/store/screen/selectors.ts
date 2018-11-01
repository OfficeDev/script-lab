import { IState } from '../reducer'

export const getWidth = (state: IState): number => state.screen.width
export const getHeight = (state: IState): number => state.screen.height
