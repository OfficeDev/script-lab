import { IState } from "../reducer";

export const getGistMetadata = (state: IState): ISharedGistMetadata[] =>
  Object.values(state.gists).filter((gist) => gist.host === state.host);
