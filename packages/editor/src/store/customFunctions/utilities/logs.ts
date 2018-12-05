import { localStorageKeys } from 'common/lib/constants';

export async function getLogsFromAsyncStorage() {
  const logKey = localStorageKeys.editor.log;
  const results = await (window as any).OfficeRuntime.AsyncStorage.getItem(logKey);
  await (window as any).OfficeRuntime.AsyncStorage.removeItem(logKey);
  return results;
}
