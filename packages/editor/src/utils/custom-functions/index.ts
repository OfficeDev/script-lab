import ts from 'typescript';
import { parseTree, IFunction } from 'custom-functions-metadata';
import { annotate as strictType } from 'common/lib/utilities/misc';

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

  const parseResult = parseTree(content, '' /* name, unused */);
  return parseResult.functions.length > 0;
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
  // Before invoking "parseTree", check if it's valid typescript (which "parseTree" assumes).
  // If not, fail early:
  const result = ts.transpileModule(fileContent, {
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES5,
      allowJs: true,
      lib: ['dom', 'es2015'],
    },
  });

  if (result.diagnostics!.length > 0) {
    return [
      {
        javascriptFunctionName: 'compileError',
        nonCapitalizedFullName: namespace + '.' + 'CompileError',
        status: 'error',
        errors: [
          'Could not compile the snippet. Please go back to the code editor to fix any syntax errors.',
        ],
        metadata: null,
      },
    ];
  }

  const parseTreeResult = parseTree(fileContent, solution.name);
  // Just in case, ensure that the result is consistent:
  if (parseTreeResult.functions.length !== parseTreeResult.extras.length) {
    throw new Error('Internal error while parsing custom function snippets.');
  }

  const functions = parseTreeResult.functions.map((metadata, index) => {
    const extras = parseTreeResult.extras[index];

    const { javascriptFunctionName } = extras;

    // For the full name, add namespace to the name.
    // Since we ideally want it non-capitalized, but the custom-function-metadata
    //   will capitalize names by default, do a comparison.
    // If the funcName and metadata name are the same (modulo casing) then just use the function name.
    // Otherwise, if the name was provided using a "@customfunction id name" syntax, use the provided name,
    //   whatever casing it's in.
    const nonCapitalizedFullName =
      namespace +
      '.' +
      (javascriptFunctionName.toUpperCase() === metadata.name.toUpperCase()
        ? javascriptFunctionName
        : metadata.name);

    // Massage the metadata a bit to reflect the sub-namespace for the snippet
    metadata.name = namespace.toUpperCase() + '.' + metadata.name;
    metadata.id = namespace.toUpperCase() + '.' + metadata.id;

    return strictType<ICustomFunctionParseResult<IFunction>>({
      javascriptFunctionName,
      nonCapitalizedFullName,
      status:
        extras.errors.length > 0
          ? 'error'
          : solution.options.isUntrusted
          ? 'untrusted'
          : 'good',
      errors: [
        ...(solution.options.isUntrusted
          ? ['You must trust the snippet before its functions can be registered']
          : []),
        ...extras.errors,
      ],
      metadata,
    });
  });

  // Ensure no duplicate function names
  functions.forEach((func, index) => {
    functions.forEach((otherFunc, otherIndex) => {
      if (
        index !== otherIndex &&
        func.javascriptFunctionName === otherFunc.javascriptFunctionName
      ) {
        func.status = 'error';
        func.errors = [
          `Duplicate implementation for function "${func.javascriptFunctionName}"`,
        ];
      }
    });
  });

  // If any functions have an error in them, then change out any other "good" ones into "skipped"
  if (functions.find(func => func.status === 'error')) {
    functions.forEach(func => {
      if (func.status === 'good') {
        func.status = 'skipped';
        func.errors = ['Skipping due to errors in other functions in the same snippet.'];
      }
    });
  }

  return functions;
}
