type ConsoleLogTypes = 'log' | 'info' | 'warn' | 'error';

interface ILogData {
  id: string;
  message: string;
  severity: ConsoleLogTypes;
}
