type ConsoleLogTypes = "log" | "info" | "warn" | "error";

/**
 * An interface for log data.
 *
 * Note: This interface is also used by the "console.monkeypatch" of
 *       the native-runtime Custom Functions.  So do not change it!
 *       This is also why the "message" property is called "message",
 *       even though it's now of "any" type and can be an object, etc.
 */
interface ILogData {
  id: string;

  /** Any object that we want to log.  It's called "message" for historic reasons
   * (see note above), but it needn't be a string.  It could be a boolean, a number,
   * an Error, a JSON object, or anything else.
   */
  message: any;

  severity: ConsoleLogTypes;
}
