type ConsoleLogTypes = 'log' | 'info' | 'warn' | 'error';

interface ILogData {
  id: string;
  message: string;
  underlyingObject?: { [key: string]: any };
  severity: ConsoleLogTypes;
}
