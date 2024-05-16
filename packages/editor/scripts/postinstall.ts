import { PACKAGE_VERSIONS, hyphenate } from "../../common/src/package-versions";

// note: this is absolutely wild!
// We're using the postinstall script to copy files from node_modules to public/external
// This is for the monaco editor which should be usable as a standard package.

const IS_LOCAL_OR_ALPHA_ENV = checkIfLocalOrAlphaEnvironment();
if (IS_LOCAL_OR_ALPHA_ENV) {
  console.info(
    "Running locally or on alpha environment, will use non-minified versions " +
      "during postinstall, where appropriate",
  );
}

const expectedPackages: {
  [key: string]: {
    name: string;
    version: string;
    copyAsName: string;
    pathToCopyFrom: string;
    pathToCopyTo: string;
  };
} = {
  monaco: {
    name: "monaco-editor",
    version: PACKAGE_VERSIONS["monaco-editor"],
    copyAsName: "monaco-editor",
    pathToCopyFrom: `${IS_LOCAL_OR_ALPHA_ENV ? "dev" : "min"}/vs`,
    pathToCopyTo: "vs",
  },
};

const additionalFilesToCopy: Array<{ from: string; to: string }> = [
  {
    from: "../../node_modules/monaco-editor/monaco.d.ts",
    to: "./src/interfaces/monaco.d.ts",
  },
];

// cspell:ignore precompile, precompiled
const oldFilesToRemove = [
  "./precompile-sources",
  "./public/vs",
  "./public/external/vs",
  "./public/precompiled",
  "./public/forge",
];

////////////////////////////////////////

import path from "path";
console.log("Running postinstall on " + path.resolve("."));

import fs from "fs";

oldFilesToRemove.forEach((filename) => {
  console.log(`Removing "${filename}`);
  if (fs.existsSync(filename)) {
    fs.rmSync(filename);
  }
});

for (const key in expectedPackages) {
  const packageToCheck = expectedPackages[key];
  console.log(
    `Checking that "${packageToCheck.name}" matches expected version "${packageToCheck.version}"`,
  );

  const data = fs.readFileSync(`../../node_modules/${packageToCheck.name}/package.json`, "utf-8");
  const packageJson = JSON.parse(data);
  if (packageJson.version !== packageToCheck.version) {
    throw new Error(
      `The ${packageToCheck.copyAsName} package does NOT match expected version. ` +
        "Please update the expected number above, " +
        `then update the version numbers at "packages/common/src/package-versions.ts".`,
    );
  }
}

const foldersToCopy: Array<{ from: string; to: string }> = [];
for (const key in expectedPackages) {
  const packageToCheck = expectedPackages[key];

  foldersToCopy.push({
    from: `../../node_modules/${packageToCheck.name}/${packageToCheck.pathToCopyFrom}`,
    to: `./public/external/${packageToCheck.copyAsName}-${hyphenate(packageToCheck.version)}${
      packageToCheck.pathToCopyTo ? "/" + packageToCheck.pathToCopyTo : ""
    }`,
  });
}

[...foldersToCopy, ...additionalFilesToCopy].forEach((pair) => {
  const { from, to } = pair;
  console.log(`Copying to "${to}"`);

  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
});

///////////////////////////////////////

function checkIfLocalOrAlphaEnvironment() {
  const { BRANCH } = process.env; // from azure-pipelines

  if (!BRANCH) {
    // running locally
    return true;
  }

  if (BRANCH === "main") {
    return true;
  }

  return false;
}
