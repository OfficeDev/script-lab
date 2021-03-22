import { CF_LOGS_ROOT } from 'common/lib/utilities/localStorage';

export async function getLogsFromAsyncStorage(): Promise<ILogData[]> {
  const logKeys = (await OfficeRuntime.storage.getKeys()).filter(key =>
    key.startsWith(CF_LOGS_ROOT),
  );

  const logEntries = await OfficeRuntime.storage.getItems(logKeys);

  const logs = Object.keys(logEntries).map(item => JSON.parse(logEntries[item]));

  await OfficeRuntime.storage.removeItems(logKeys);
  return logs;
}
