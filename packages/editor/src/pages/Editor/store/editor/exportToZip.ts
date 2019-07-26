import JSZip from 'jszip';

import { saveAs } from 'file-saver';

export async function exportToZip(activeSolution: ISolution) {

    // hmm... for some reason can not export as zip from an actual host, only works in the web
    // host does not contain the flavor - {win32, web, mac}

    // need to figure out the flavor, and disable option for non web for now
    // need to grab files from GitHub

    const zip: JSZip = new JSZip();

    let typescriptFile: string = "";
    let htmlConts: string = "";
    let cssContents: string = "";
    let librariesContents: string = "";



    /*
    index.ts
    index.html
    index.css
    libraries.txt
    */
    const userFiles = activeSolution.files.map((file) => {
        return [file.language, file.content];
        // console.log(file.name);
        // zip.file(file.name, file.content);
    });

    const userContents = new Map(userFiles as [[string, string]]);

    const host = activeSolution.host;

    // Only word is supported at the moment with a template for ScriptLab
    if (host === "WORD" || true) {
        const files = await getGitHubFiles("wandyezj", "office-add-in-template-taskpane-word", "");

        const promises = files.map(async (file) => {
            const path = file.path;
            const download_url = file.download_url;

            // map of user contents over the template
            let contents: any;
            if (path === "taskpane.html") {
                const htmlContent: string = userContents.get("html");
                contents = await getGitHubTextFileData(download_url);
                contents = contents.replace("<!-- TaskPane body -->", htmlContent);

                // TODO: Special consideration is required for the included packages
            } else if (path === "taskpane.css") {
                contents = userContents.get("css");
            } else if (path === "taskpane.ts") {
                const typescriptContent: string = userContents.get("typescript");
                contents = typescriptContent;

                // make sure Office.onReady is present until it is no longer necessary
                if (contents.indexOf("Office.onReady(") === -1) {
                    contents = await getGitHubTextFileData(download_url) + contents;
                }
            } else {
                contents = await getGitHubFileData(download_url);
            }

            zip.file(path, contents);
        });

        await Promise.all(promises);
    } else {
        // otherwise simply save all the files
        // able to specify a directory
        zip.file("metadata/host.txt", host);
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
        // see FileSaver.js
        saveAs(content, activeSolution.name + ".zip");
    });

    console.log(activeSolution);
}


async function getJson(url) {
    const request = new Request(url, { method: 'GET' });
    const response = await fetch(request);
    const o = await response.json();
    return o;
}

function insertUrlParameters(s, map) {
    map.forEach((value, key, map) => {
        s = s.replace(":" + key, value);
    });
    return s;
}

async function getGitHubApi(api, parameters) {
    const base = 'https://api.github.com';
    const query = base + insertUrlParameters(api, parameters);
    const o = await getJson(query);
    return o;
}

async function getGitHubUser(user) {
    const url = 'https://api.github.com/users/' + user;
    const o = await getJson(url);
    return o;
}

async function getGitHubRepoReadme(owner, repo) {
    const api = '/repos/:owner/:repo/readme';
    const parameters = new Map([['owner', owner], ['repo', repo]]);

    const o = await getGitHubApi(api, parameters);
    return o;
}

async function getGitHubPathContents(owner, repo, path) {
    // https://developer.github.com/v3/repos/contents/#get-contents
    const api = '/repos/:owner/:repo/contents/:path';
    const parameters = new Map([['owner', owner], ['repo', repo], ['path', path]]);

    const o = await getGitHubApi(api, parameters);
    return o;
}

async function getGitHubFileData(download_url) {
    const response = await fetch(download_url);
    const contents = await response.blob();
    return contents;
}

async function getGitHubTextFileData(download_url) {
    const response = await fetch(download_url);
    const contents = await response.text();
    return contents;
}

function reduceDirectoryItems(items) {
    const reduced = items.map((file) => {
        return {
            type: file.type,
            path: file.path,
            download_url: file.download_url
        }
    });

    return reduced;
}

function getReduceFiles(reduceItems) {
    return reduceItems.filter((file) => file.type === "file");
}

function getReduceDirectories(reduceItems) {
    return reduceItems.filter((file) => file.type === "dir");
}


async function getGitHubFiles(owner, repo, path) {

    const allFiles = [];
    const unexploredDirectories = [path];

    while (unexploredDirectories.length > 0) {

        const directory = unexploredDirectories.shift();
        const items = await getGitHubPathContents(owner, repo, directory);

        const reduced = reduceDirectoryItems(items);
        const files = getReduceFiles(reduced);
        const directories = getReduceDirectories(reduced);

        allFiles.push(...files);

        const directoryPaths = directories.map((directory) => directory.path);
        unexploredDirectories.push(...directoryPaths);
    }

    return allFiles;
}