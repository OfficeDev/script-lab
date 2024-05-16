import createGUID from "uuid";
import { LIBRARIES_FILE_NAME, SCRIPT_FILE_NAME } from "common/build/utilities/solution";

export const getBoilerplateFiles = (timestamp: number): IFile[] =>
  [
    {
      name: SCRIPT_FILE_NAME,
      language: "TypeScript",
      content: `$("#run").click(() => tryCatch(run));

async function run() {
    console.log("Hello World");
}

/** Default helper for invoking an action and handling errors. */
async function tryCatch(callback) {
    try {
        await callback();
    }
    catch (error) {
        OfficeHelpers.UI.notify(error);
        OfficeHelpers.Utilities.log(error);
    }
}
`,
    },
    {
      name: "index.html",
      language: "HTML",
      content: `<p class="ms-font-m">Executes a simple code snippet.</p>
<button id="run" class="ms-Button">
    <span class="ms-Button-label">Run code</span>
</button>
`,
    },
    { name: "index.css", language: "CSS", content: "" },
    {
      name: LIBRARIES_FILE_NAME,
      language: "libraries",
      content: `https://appsforoffice.microsoft.com/lib/1/hosted/office.js
https://appsforoffice.microsoft.com/lib/1/hosted/office.d.ts

office-ui-fabric-js@1.4.0/dist/css/fabric.min.css
office-ui-fabric-js@1.4.0/dist/css/fabric.components.min.css

core-js@2.4.1/client/core.min.js
@types/core-js

jquery@3.1.1
@types/jquery`,
    },
  ].map((file) => ({
    ...file,
    id: createGUID(),
    dateCreated: timestamp,
    dateLastModified: timestamp,
    dateLastOpened: timestamp,
  }));

export const getBoilerplateSolution = (
  host: string,
  files: IFile[],
  timestamp: number,
): ISolution => ({
  id: createGUID(),
  name: `Blank Snippet`,
  host,
  dateCreated: timestamp,
  dateLastModified: timestamp,
  dateLastOpened: timestamp,
  options: {},
  files,
});

export const getBoilerplate = (host: string): ISolution => {
  const timestamp = Date.now();

  const files = getBoilerplateFiles(timestamp);
  const solution = getBoilerplateSolution(host, files, timestamp);

  return solution;
};
