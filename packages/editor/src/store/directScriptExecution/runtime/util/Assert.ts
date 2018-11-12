// a collection of methods to throw Errors if conditions aren't matched
export default class Assert {
  static Equals<T extends number | boolean | string>(actual: T, expected: T): void {
    if (actual !== expected) {
      throw new Error(
        `${JSON.stringify(actual)} does not match expected ${JSON.stringify(expected)}`,
      );
    }
  }
  static True(expression: boolean, explanation?: string): void {
    if (!expression) {
      throw new Error(`Bad program state. ${explanation || ''}`);
    }
  }
  static Truthy(expression: any, explanation?: string): void {
    if (!expression) {
      throw new Error(`Bad program state. ${explanation || ''}`);
    }
  }
}
