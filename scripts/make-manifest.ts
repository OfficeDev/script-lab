//
// localhost -> production
// localhost -> internal
// localhost -> target
// Create other manifests from localhost manifests by replacing local strings with production options.
//

import path from "path";
import fs from "fs";

type Transform =
  | [string, string]
  | [
      string,
      string,
      {
        /**
         * Replace all occurrences
         */
        all?: boolean;
        /**
         * Name of the manifest file to replace for, otherwise all.
         */
        names?: string[];
      },
    ];

function doTransform(name: string, data: string, replaces: Transform[]): string {
  for (const replace of replaces) {
    const [before, after, options] = replace;

    if (options && options.names && !options.names.includes(name)) {
      continue;
    }

    if (!data.includes(before)) {
      console.error(`Not found:\n${before}\n`);
      continue;
    }

    if (options && options.all) {
      data = data.replaceAll(before, after);
    } else {
      data = data.replace(before, after);
    }
  }

  return data;
}

/*
    <!-- Production Domains -->
    <!-- WW -->
    <AppDomain>https://script-lab.public.cdn.office.net</AppDomain>
    <AppDomain>https://script-lab-runner.public.cdn.office.net</AppDomain>

    <!-- SDF -->
    <AppDomain>https://script-lab.sdf.cdn.office.net</AppDomain>
    <AppDomain>https://script-lab-runner.sdf.cdn.office.net</AppDomain>
*/

const targetDomain = "https://wbp-autobox-002.redmond.corp.microsoft.com:444";

/**
 * Make local manifest from production manifest
 * @param data
 * @returns
 */
function makeProductionManifest(name: string, data: string): string {
  const replaces: Transform[] = [
    // Domains
    [
      `<AppDomains>
    <AppDomain>https://localhost:3000</AppDomain>
    <AppDomain>https://localhost:3200</AppDomain>`,
      `<AppDomains>
    <AppDomain>https://script-lab.public.cdn.office.net</AppDomain>
    <AppDomain>https://script-lab-runner.public.cdn.office.net</AppDomain>`,
      {
        names: ["production.xml", "production.outlook.xml"],
      },
    ],
    [
      `<AppDomains>
    <AppDomain>https://localhost:3000</AppDomain>
    <AppDomain>https://localhost:3200</AppDomain>`,
      `<AppDomains>
    <AppDomain>https://script-lab.sdf.cdn.office.net</AppDomain>
    <AppDomain>https://script-lab-runner.sdf.cdn.office.net</AppDomain>`,
      {
        names: ["internal.xml", "internal.outlook.xml"],
      },
    ],
    [
      `<AppDomains>
    <AppDomain>https://localhost:3000</AppDomain>
    <AppDomain>https://localhost:3200</AppDomain>`,
      `<AppDomains>
    <AppDomain>${targetDomain}</AppDomain>`,
      {
        names: ["target.xml", "target.outlook.xml"],
      },
    ],

    // Urls
    [
      `DefaultValue="https://localhost:3000`,
      `DefaultValue="https://script-lab.public.cdn.office.net/script-lab/7dttl`,
      {
        all: true,
        names: ["production.xml", "production.outlook.xml"],
      },
    ],
    [
      `DefaultValue="https://localhost:3000`,
      `DefaultValue="https://script-lab.sdf.cdn.office.net/script-lab/7dttl`,
      {
        all: true,
        names: ["internal.xml", "internal.outlook.xml"],
      },
    ],
    [
      `DefaultValue="https://localhost:3000`,
      `DefaultValue="${targetDomain}/script-lab/edit`,
      {
        all: true,
        names: ["target.xml", "target.outlook.xml"],
      },
    ],

    //
    // WXP
    //

    // Id
    [
      "<Id>632ed84c-2c4a-4e4b-bc87-353bcf7a34d5</Id>",
      "<Id>8bc018e3-f345-40d4-8f1d-97951765d531</Id>",
      { names: ["production.xml"] },
    ],
    [
      "<Id>632ed84c-2c4a-4e4b-bc87-353bcf7a34d5</Id>",
      "<Id>632ed84c-7357-4e4b-bc87-353bcf7a34d5</Id>",
      { names: ["internal.xml"] },
    ],
    [
      "<Id>632ed84c-2c4a-4e4b-bc87-353bcf7a34d5</Id>",
      "<Id>00000000-7357-7357-7357-353bcf7a34d5</Id>",
      { names: ["target.xml"] },
    ],

    // Label
    [`[LOCAL] `, ``, { names: ["production.xml"], all: true }],
    [`[LOCAL] `, `[INTERNAL] `, { names: ["internal.xml"], all: true }],
    [`[LOCAL] `, `[TARGET] `, { names: ["target.xml"], all: true }],

    //
    // Outlook
    //

    // Id
    [
      `<Id>27d05373-d759-49b2-86b1-8aab78981686</Id>`,
      `<Id>49d3b812-abda-45b9-b478-9bc464ce5b9c</Id>`,
      { names: ["production.outlook.xml"] },
    ],
    [
      `<Id>27d05373-d759-49b2-86b1-8aab78981686</Id>`,
      `<Id>27d05373-7357-49b2-86b1-8aab78981686</Id>`,
      { names: ["internal.outlook.xml"] },
    ],
    [
      `<Id>27d05373-d759-49b2-86b1-8aab78981686</Id>`,
      `<Id>00000000-7357-7357-7357-8aab78981686</Id>`,
      { names: ["target.outlook.xml"] },
    ],

    // Label
    [`[LOCAL] `, ``, { names: ["production.outlook.xml"], all: true }],
    [`[LOCAL] `, `[INTERNAL] `, { names: ["internal.outlook.xml"], all: true }],
    [`[LOCAL] `, `[TARGET] `, { names: ["target.outlook.xml"], all: true }],
  ];

  // Replace production strings with localhost strings
  data = doTransform(name, data, replaces);

  return data;
}

const manifestsDirectory = path.resolve(__dirname, "../manifests");
const manifestLocalhostNames = ["localhost.xml", "localhost.outlook.xml"];

/**
 * production - production manifests
 * internal - internal manifests
 * target - target manifests for specific projects
 */
function makeManifests(categoryName: "production" | "internal" | "target") {
  manifestLocalhostNames.forEach((name) => {
    const data = fs.readFileSync(path.join(manifestsDirectory, name), "utf8");

    // Make production manifest
    const categoryManifestName = name.replace("localhost", categoryName);
    console.log(`make ${name} -> ${categoryManifestName}`);
    const categoryData = makeProductionManifest(categoryManifestName, data);
    fs.writeFileSync(path.join(manifestsDirectory, categoryManifestName), categoryData);
  });
}

makeManifests("production");
makeManifests("internal");
makeManifests("target");
