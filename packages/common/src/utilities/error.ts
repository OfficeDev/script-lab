import { CustomError } from '@microsoft/office-js-helpers';

/**
 * A class for specifying an Error object with some inner details
 */
export class ScriptLabError extends CustomError {
  constructor(message: string, innerError?: Error) {
    super('Script Lab Error', message, innerError);
    Object.setPrototypeOf(this, ScriptLabError.prototype);
  }
}
