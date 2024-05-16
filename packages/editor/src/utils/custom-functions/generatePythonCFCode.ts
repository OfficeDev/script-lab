import flatten from "lodash/flatten";
import { findScript } from "common/build/utilities/solution";
import { transformSolutionNameToCFNamespace, PythonCFSnippetRegex } from ".";

const SEPARATOR = "#######################################";

export default (pythonCFs: ISolution[], options: { clearOnRegister: boolean }) => {
  return [
    "import customfunctionmanager",
    options.clearOnRegister ? "customfunctionmanager.clear()" : null,
    "",
    SEPARATOR,
    "",
    ...flatten(
      pythonCFs
        .filter((solution) => !solution.options.isUntrusted)
        .map((solution) => {
          const script = findScript(solution).content;
          const namespace = transformSolutionNameToCFNamespace(solution.name);
          return injectNamespace(script, namespace);
        })
        .map((snippet) => [snippet, SEPARATOR, ""]),
    ),
    "customfunctionmanager.generateMetadata()",
  ]
    .filter((line) => line !== null)
    .join("\n");
};

function injectNamespace(script: string, namespace: string) {
  // Note: need to re-create the regex to inject the "global" and "multiline" flags into it
  //    (and don't want to do it in the general case in the original regex, because
  //     a regex with a "g" flag becomes a state-ful object that needs to be reset -- see
  //     https://stackoverflow.com/questions/11477415 for more info)
  const regex = new RegExp(PythonCFSnippetRegex, "gm");

  return script.replace(regex, (_fullMatch, before: string, customName: string, after: string) => {
    return before + `${namespace}.${customName}` + after;
  });
}
