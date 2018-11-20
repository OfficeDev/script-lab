type ConsoleLogTypes = 'log' | 'info' | 'warn' | 'error';

interface ILogData {
  source: string;
  message: any;
  severity: ConsoleLogTypes;
}
