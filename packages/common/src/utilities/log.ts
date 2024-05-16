import loglevel, { Logger } from "loglevel";
import prefix from "loglevel-plugin-prefix";

let prefixAlreadyRegistered = false;
const initializedLoggers: { [key: string]: Logger } = {};

export function getLogger(name: string): Logger {
  if (!prefixAlreadyRegistered) {
    prefix.reg(loglevel);
    prefixAlreadyRegistered = true;
  }

  if (!initializedLoggers[name]) {
    const logger = loglevel.getLogger(name);
    const storedLevel = window.localStorage.getItem("loglevel:" + name);
    if (storedLevel) {
      logger.setLevel(storedLevel as any);
    } else {
      logger.setLevel(
        process.env.NODE_ENV === "production" ? loglevel.levels.WARN : loglevel.levels.TRACE,
      );
    }

    prefix.apply(logger, {
      template: "%l (%n):",
      levelFormatter(level) {
        return level.toUpperCase();
      },
      nameFormatter(name) {
        return name || "global";
      },
    });

    initializedLoggers[name] = logger;
  }

  return initializedLoggers[name];
}

export const levels = loglevel.levels;
export function isLoggerEnabled(name: string, level: number) {
  return getLogger(name).getLevel() <= level;
}
