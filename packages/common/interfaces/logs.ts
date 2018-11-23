type ConsoleLogTypes = 'log' | 'info' | 'warn' | 'error';

interface ILogData {
  message: string;
  severity: ConsoleLogTypes;
}
