import { WINDOW_SCRIPT_LAB_IS_READY_KEY } from './constants';

export function waitForAllDynamicScriptsToBeLoaded(): Promise<void> {
  if ((window as any)[WINDOW_SCRIPT_LAB_IS_READY_KEY]) {
    return Promise.resolve();
  }
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if ((window as any)[WINDOW_SCRIPT_LAB_IS_READY_KEY]) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}
