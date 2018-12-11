import { CF_LOGS_ROOT } from 'common/lib/utilities/localStorage';

export async function getLogsFromAsyncStorage(): Promise<ILogData[]> {
  const logKeys = (await OfficeRuntime.AsyncStorage.getAllKeys()).filter(key =>
    key.startsWith(CF_LOGS_ROOT),
  );

  const logs = (await OfficeRuntime.AsyncStorage.multiGet(logKeys)).map(([key, value]) =>
    JSON.parse(value),
  );

  await OfficeRuntime.AsyncStorage.multiRemove(logKeys);
  return logs;
}
