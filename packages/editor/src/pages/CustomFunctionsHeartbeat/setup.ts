import "core-js/fn/array/find";

import { currentRunnerUrl, sameOrigin, getOrigin } from "common/build/environment";
import { CF_HEARTBEAT_POLLING_INTERVAL } from "common/build/constants";

import {
  getCustomFunctionsLastRegisteredTimestamp,
  getAllLocalStorageKeys,
  SOLUTION_ROOT,
  readItem,
  writeItem,
  CF_LOGS_ROOT,
} from "common/build/utilities/localStorage";
import compileScript from "common/build/utilities/compile.script";
import processLibraries from "common/build/utilities/process.libraries";
import {
  parseMetadata,
  transformSolutionNameToCFNamespace,
  getCustomFunctionsRuntimeUrl,
} from "../../utils/custom-functions";
import type { IFunction } from "common/build/custom-functions/parseTree";
import { strictType } from "common/build/utilities/misc";
import { findScript } from "common/build/utilities/solution";
import { getPythonConfigIfAny } from "../../utils/python";

export default function setup() {
  // ========================= REFRESH =================================//
  setInterval(() => {
    if (checkShouldUpdate()) {
      // if changes in the custom functions solutions are detected,
      // send the runner a {type: 'refresh'}
      sendMessageToRunner({ type: "refresh" });
    }
  }, CF_HEARTBEAT_POLLING_INTERVAL);

  const initialMetadataTimestamp = getCustomFunctionsLastRegisteredTimestamp();
  function checkShouldUpdate(): boolean {
    return getCustomFunctionsLastRegisteredTimestamp() > initialMetadataTimestamp;
  }

  // ========================= LOGS =================================//
  window.onmessage = (event) => {
    if (!sameOrigin(event.origin, currentRunnerUrl)) {
      // console.error(`Ignoring message from an invalid origin "${event.origin}"`);
      return;
    }

    const message: ICustomFunctionsHeartbeatMessage = JSON.parse(event.data);

    switch (message.type) {
      case "log":
        addLog(message as ICustomFunctionsHeartbeatLogMessage);
        break;
      default:
        throw new Error(`Unknown message type: "${message.type}`);
    }
  };

  // ========================= METADATA  =================================//
  sendMessageToRunner({ type: "metadata", payload: getMetadata() });
}

// ========================= HELPERS  ==================================//
function sendMessageToRunner(message: ICustomFunctionsHeartbeatMessage) {
  const runnerOrigin = getOrigin(currentRunnerUrl);
  window.parent.postMessage(JSON.stringify(message), runnerOrigin);
}

function getMetadata(): ICustomFunctionsIframeRunnerOnLoadPayload {
  const allTrustedCFSolutions = loadAllCFSolutions().filter(
    (solution: ISolution) => !solution.options.isUntrusted,
  );

  const cfSolutionsGroupedByLanguage = {
    typescript: [] as ISolution[],
    python: [] as ISolution[],
  };

  allTrustedCFSolutions.forEach((solution) => {
    const scriptFile = findScript(solution);
    const groupToPushTo: ISolution[] = cfSolutionsGroupedByLanguage[scriptFile.language];
    if (!groupToPushTo) {
      throw new Error(`Invalid language specified for solution ` + solution.id);
    }

    groupToPushTo.push(solution);
  });

  return {
    typescriptMetadata: cfSolutionsGroupedByLanguage.typescript
      .map((solution: ISolution) => {
        try {
          const scriptFile = findScript(solution);
          const namespace = transformSolutionNameToCFNamespace(solution.name);

          const script = scriptFile.content;

          const libraries = solution.files.find(
            (file: IFile) => file.name === "libraries.txt",
          )!.content;

          const metadata: Array<ICustomFunctionParseResult<IFunction>> = parseMetadata({
            solution,
            namespace,
            fileContent: script,
          });

          if (metadata.some((item) => item.status !== "good")) {
            return null;
          }

          return strictType<ICustomFunctionsIframeRunnerTypeScriptMetadata>({
            solutionId: solution.id,
            namespace: namespace,
            functions: metadata.map((item) => ({
              fullId: item.metadata.id,
              fullDisplayName: item.metadata.name,
              javascriptFunctionName: item.javascriptFunctionName,
            })),

            code: compileScript(script),
            jsLibs: processLibraries(
              libraries,
              false /* hard-coding to "false" because ignoring office.js-script-reference result */,
            ).scriptReferences,
          });
        } catch (error) {
          console.error(error);
          return null;
        }
      })
      .filter((x) => x !== null),

    pythonConfig: cfSolutionsGroupedByLanguage.python.length === 0 ? null : getPythonConfigIfAny(),

    customFunctionsRuntimeUrl: getCustomFunctionsRuntimeUrl(),
  };
}

function loadAllCFSolutions(): ISolution[] {
  return getAllLocalStorageKeys()
    .filter((key) => key.indexOf(SOLUTION_ROOT) === 0)
    .map((key) => key.replace(SOLUTION_ROOT, ""))
    .map((id) => readItem(SOLUTION_ROOT, id) as ISolution)
    .filter((solution: ISolution) => solution.options.isCustomFunctionsSolution);
}

function addLog({ payload }: ICustomFunctionsHeartbeatLogMessage) {
  writeItem(CF_LOGS_ROOT, payload.id, payload);
}
