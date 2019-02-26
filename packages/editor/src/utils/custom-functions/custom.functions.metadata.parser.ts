import { parseTree, IFunction } from 'custom-functions-metadata';
import { annotate } from 'common/lib/utilities/misc';

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
  solution: ISolution;
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
      additionalInfo: null /*FIXME*/,
      metadata,
    });
  });

  return functions;
}
