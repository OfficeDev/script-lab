import { IState } from '../reducer';
import { getObjectValues } from '../../utils';

export const getGistMetadata = (state: IState): ISharedGistMetadata[] =>
  getObjectValues(state.gists).filter(gist => gist.host === state.host);
