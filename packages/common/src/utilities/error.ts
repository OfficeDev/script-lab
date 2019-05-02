import { CustomError } from '@microsoft/office-js-helpers';

/**
 * A class for specifying an Error object with some inner details
 */
export class ScriptLabError extends CustomError {
  private options: { hideCloseButton: boolean };

  constructor(
    message: string,
    innerError?: Error | string,
    options = { hideCloseButton: false },
  ) {
    super('Script Lab Error', message, innerError as any);
    Object.setPrototypeOf(this, ScriptLabError.prototype);

    this.options = options;
  }

  get hideCloseButton() {
    return this.options.hideCloseButton;
  }
}
