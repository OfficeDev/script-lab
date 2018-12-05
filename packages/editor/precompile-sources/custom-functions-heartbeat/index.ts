import 'core-js/fn/array/find';
import { currentRunnerUrl } from 'common/lib/environment';
import ensureFreshLocalStorage from 'common/lib/utilities/ensure.fresh.local.storage';
import { CF_HEARTBEAT_POLLING_INTERVAL, localStorageKeys } from 'common/lib/constants';
import {
  getAllLocalStorageKeys,
  SOLUTION_ROOT,
  readItem,
} from 'common/lib/utilities/localStorage';
import { parseMetadata } from 'common/lib/utilities/custom.functions.metadata.parser';
import compileScript from 'common/lib/utilities/compile.script';
import processLibraries from 'common/lib/utilities/process.libraries';

// if changes in the custom functions solutions are detected,
// send the runner a {type: 'refresh'}
setInterval(() => {
  if (checkShouldUpdate()) {
    sendMessageToRunner({ type: 'refresh' });
  }
}, CF_HEARTBEAT_POLLING_INTERVAL);

// send the runner metadata
sendMessageToRunner({ type: 'metadata', payload: getMetadata() });

window.onmessage = event => {
  if (event.origin !== currentRunnerUrl) {
    console.error(`Ignoring message from an invalid origin "${event.origin}"`);
    return;
  }

  const message: ICFHeartbeatMessage = JSON.parse(event.data);

  switch (message.type) {
    case 'log':
      addLog(message as ICFLogMessage);
      break;
    default:
      throw new Error(`Unknown message type: "${message.type}`);
  }
};

// helpers
function sendMessageToRunner(message: ICFHeartbeatMessage) {
  window.parent.postMessage(JSON.stringify(message), currentRunnerUrl);
}

function getMetadata(): ICFMetadata[] {
  return loadAllCFSolutions()
    .filter((solution: ISolution) => !solution.options.isUntrusted)
    .map((solution: ISolution) => {
      try {
        const namespace = transformSolutionName(solution.name);
        const script = solution.files.find(file => file.name === 'index.ts')!.content;
        const libraries = solution.files.find(file => file.name === 'libraries.txt')!
          .content;

        const metadata: ICFVisualFunctionMetadata[] = parseMetadata(
          namespace,
          script,
        ) as ICFVisualFunctionMetadata[];

        if (metadata.filter(({ error }) => !!error).length > 0) {
          return null;
        }

        return {
          solutionId: solution.id,
          namespace,
          functionNames: metadata.map(({ funcName }) => funcName),
          code: compileScript(script),
          jsLibs: processLibraries(
            libraries,
            false /* hardcoding because ignoring officeJS result */,
          ).scriptReferences,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    })
    .filter(x => x !== null) as ICFMetadata[];
}

function loadAllCFSolutions() {
  return getAllLocalStorageKeys()
    .filter(key => key.indexOf(SOLUTION_ROOT) === 0)
    .map(key => key.replace(SOLUTION_ROOT, ''))
    .map(id => readItem(SOLUTION_ROOT, id))
    .filter((solution: ISolution) => solution.options.isCustomFunctionsSolution);
}

const initialMetadataTimestamp = getCustomFunctionsLastUpdated();
function checkShouldUpdate(): boolean {
  return getCustomFunctionsLastUpdated() > initialMetadataTimestamp;
}

function addLog(log: ICFLogMessage) {
  ensureFreshLocalStorage();
  const existingLogs = JSON.parse(
    localStorage.getItem(localStorageKeys.editor.log) || '[]',
  );
  const newLogs = [...existingLogs, log.payload];
  localStorage.setItem(localStorageKeys.editor.log, JSON.stringify(newLogs));
}

function getCustomFunctionsLastUpdated(): number {
  ensureFreshLocalStorage();

  const lastUpdated = localStorage.getItem(
    localStorageKeys.editor.customFunctionsLastUpdatedCodeTimestamp,
  );
  return lastUpdated ? +lastUpdated : 0;
}

export function transformSolutionName(solutionName: string) {
  return solutionName
    .replace(/[^0-9A-Za-z_ ]/g, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}
