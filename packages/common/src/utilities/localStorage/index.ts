import isEqual from 'lodash/isEqual';
import { localStorageKeys } from '../../constants';
import ensureFreshLocalStorage from '../ensure.fresh.local.storage';

export const GITHUB_KEY = 'github';
export const SOLUTION_ROOT = 'solution#';

// custom functions
export const getIsCustomFunctionRunnerAlive = (): boolean => {
  ensureFreshLocalStorage();

  const lastHeartbeat = localStorage.getItem(
    localStorageKeys.editor.customFunctionsLastHeartbeatTimestamp,
  );
  return lastHeartbeat ? +lastHeartbeat > 3000 : false;
};

export const getCustomFunctionCodeLastUpdated = (): number => {
  ensureFreshLocalStorage();

  const lastUpdated = localStorage.getItem(
    localStorageKeys.editor.customFunctionsLastUpdatedCodeTimestamp,
  );
  return lastUpdated ? +lastUpdated : 0;
};

export const getCustomFunctionLogsFromLocalStorage = (): string | null => {
  ensureFreshLocalStorage();

  const logString = localStorage.getItem(localStorageKeys.editor.log);
  localStorage.removeItem(localStorageKeys.editor.log);

  return logString;
};

// helpers
export function writeIfChanged<T>(
  selector: (state: T) => any,
  getKey: ((selectionResult: any) => string) | string,
  currentState: T,
  lastState: T | undefined,
  root: string = '',
) {
  const current = selector(currentState);
  const last = lastState ? selector(lastState) : null;
  const key = typeof getKey === 'string' ? getKey : getKey(current);
  if (current && (!last || !isEqual(current, last))) {
    writeItem(root, key, current);
  }
}

export function writeItem(root: string, id: string, object: any) {
  localStorage.setItem(`${root}${id}`, JSON.stringify(object));
}

export function readItem(root: string, id: string) {
  return JSON.parse(localStorage.getItem(`${root}${id}`) || 'null');
}

export function deleteItem(root: string, id: string) {
  localStorage.removeItem(`${root}${id}`);
}

export function getAllLocalStorageKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      keys.push(key);
    }
  }
  return keys;
}
