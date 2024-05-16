/**
 * Custom error type
 */
abstract class CustomError extends Error {
  constructor(
    public name: string,
    public message: string,
    public innerError?: Error,
  ) {
    super(message);
    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, this.constructor);
    } else {
      let error = new Error();
      if (error.stack) {
        let last_part = error.stack.match(/[^\s]+$/);
        this.stack = `${this.name} at ${last_part}`;
      }
    }
  }
}
/**
 * A class for specifying an Error object with some inner details
 */
export class ScriptLabError extends CustomError {
  options: { hideCloseButton: boolean };

  constructor(message: string, innerError?: Error | string, options = { hideCloseButton: false }) {
    super("Script Lab Error", message, innerError as any);
    Object.setPrototypeOf(this, ScriptLabError.prototype);

    this.options = options;
  }
}
