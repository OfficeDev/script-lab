import sanitize from 'sanitize-html';

export function sanitizeObject<T>(obj: T): T {
  return Object.keys(obj).reduce(
    (all, argName) => ({ ...all, [argName]: sanitize(obj[argName]) }),
    {},
  ) as T;
}
