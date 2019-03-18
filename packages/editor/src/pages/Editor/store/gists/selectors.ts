import { IState } from '../reducer';
import { selectors as host } from 'script-lab-core/lib/modules/host';

export const getGistMetadata = (state: IState): ISharedGistMetadata[] =>
  Object.values(state.gists).filter(gist => gist.host === host.get(state));
