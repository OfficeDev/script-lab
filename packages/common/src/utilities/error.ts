import { CustomError } from '@microsoft/office-js-helpers';

/**
 * A class for specifying an Error object with some inner details
 */
export class ScriptLabError extends CustomError {
  constructor(message: string, innerError?: Error | string) {
    super('Script Lab Error', message, innerError as any);
    Object.setPrototypeOf(this, ScriptLabError.prototype);
  }
}
