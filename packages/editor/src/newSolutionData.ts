import uuidv4 from 'uuid'

export const getBoilerplateFiles = (timestamp: number): IFile[] =>
  [
    {
      name: 'index.ts',
      language: 'TypeScript',
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
      name: 'index.html',
      language: 'HTML',
      content: `<p class="ms-font-m">Executes a simple code snippet.</p>
<button id="run" class="ms-Button">
    <span class="ms-Button-label">Run code</span>
</button>
`,
    },
    { name: 'index.css', language: 'CSS', content: '' },
    {
      name: 'libraries.txt',
      language: 'libraries',
      content: `https://appsforoffice.microsoft.com/lib/1/hosted/office.js
https://appsforoffice.microsoft.com/lib/1/hosted/office.d.ts

office-ui-fabric-js@1.4.0/dist/css/fabric.min.css
office-ui-fabric-js@1.4.0/dist/css/fabric.components.min.css

core-js@2.4.1/client/core.min.js
@types/core-js

@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js
@microsoft/office-js-helpers@0.7.4/dist/office.helpers.d.ts

jquery@3.1.1
@types/jquery`,
    },
  ].map(file => ({
    ...file,
    id: uuidv4(),
    dateCreated: timestamp,
    dateLastModified: timestamp,
  }))

export const getBoilerplateSolution = (
  host: string,
  files: IFile[],
  timestamp: number,
): ISolution => ({
  id: uuidv4(),
  name: `Blank Snippet`,
  host,
  dateCreated: timestamp,
  dateLastModified: timestamp,
  files,
})

export const getBoilerplate = (host: string): ISolution => {
  const timestamp = Date.now()

  const files = getBoilerplateFiles(timestamp)
  const solution = getBoilerplateSolution(host, files, timestamp)

  return solution
}
