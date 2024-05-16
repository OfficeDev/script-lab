import { IState } from "./reducer";
import selectors from "./selectors";

export const saveState = (state: IState) => {
  const isWeb = selectors.host.getIsWeb();
  if (isWeb) {
    const host = selectors.host.get(state);
    sessionStorage.setItem("host", host);
  }
};
export const loadState = (): Partial<IState> => {
  const isWeb = selectors.host.getIsWeb();
  let host;

  if (isWeb) {
    host = sessionStorage.getItem("host") || undefined;
  }

  return { host };
};
