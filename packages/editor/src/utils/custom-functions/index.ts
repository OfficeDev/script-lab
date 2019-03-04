import { parseTree /* FIXME IFunction */ } from 'custom-functions-metadata';
interface IFunction {}
import { annotate } from 'common/lib/utilities/misc';

export function isCustomFunctionScript(content: string) {
  // Start by doing a quick match for a custom functions regex.
  // This one is super cheap to do, though it may have false positives (e.g., a snippet
  //   that has "@customfunction" but not inside a JSDOC tag).
  // So if it passes, do a follow-up and call into 'custom-functions-metadata' to do
  //   the slower but more accurate check.

  const isCustomFunctionRegex = /[\s\*]@customfunction[\s\*]/i; // a regex for "@customfunction" that's
  //  either preceded or followed by a "*" or space -- i.e., a whole-word match, to avoid something like
  //  "@customfunctions" (with a plural "s" on the end).
  //   cspell:ignore customfunctions

  if (!isCustomFunctionRegex.test(content)) {
    return false;
  }

  return parseTree(content, '' /* name, unused */).length > 0;
}

/**
 * This function parses out the metadata for the various @customfunction's defined in the `fileContent`.
 * It will either either return an array of metadata objects, or throw a JSON.stringified error object if there are errors/unsupported types.
 * @param fileContent - The string content of the typescript file to parse the custom functions metadata out of.
 */
export function parseMetadata({
  solution,
  namespace,
  fileContent,
}: {
  solution: {
    name: string;
    options: { isUntrusted?: boolean };
  } /* the relevant parts from ISolution */;
  namespace: string;
  fileContent: string;
}): Array<ICustomFunctionParseResult<IFunction>> {
  const functions = parseTree(fileContent, solution.name).map(metadata => {
    const funcName = metadata.name;
    const nonCapitalizedFullName = namespace + '.' + funcName;
    const capitalizedFullName = nonCapitalizedFullName.toUpperCase();

    // Massage the metadata a bit:
    metadata.name = capitalizedFullName;
    metadata.id = capitalizedFullName;

    return annotate<ICustomFunctionParseResult<IFunction>>({
      funcName,
      nonCapitalizedFullName,
      status: solution.options.isUntrusted
        ? 'untrusted'
        : 'good' /* FIXME. Also account for skipping sibling functions */,
      additionalInfo: solution.options.isUntrusted
        ? ['You must trust the snippet before its functions can be registered']
        : null /*FIXME*/,
      metadata,
    });
  });

  return functions;
}
