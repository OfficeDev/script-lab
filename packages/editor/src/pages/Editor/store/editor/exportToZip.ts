import JSZip from 'jszip';

import { saveAs } from 'file-saver';

export async function exportToZip(activeSolution: ISolution) {

    // hmm... for some reason can not export as zip from an actual host, only works in the web
    // host does not contain the flavor - {win32, web, mac}

    // need to figure out the flavor, and disable option for non web for now
    // need to grab files from GitHub

    const zip: JSZip = new JSZip();

    /*
    index.ts
    index.html
    index.css
    libraries.txt
    */
    activeSolution.files.forEach((file) => {
        console.log(file.name);
        zip.file(file.name, file.content);
    });

    // able to specify a directory
    zip.file("metadata/host.txt", activeSolution.host);

    const files = await getGitHubFiles("wandyezj", "word-rhyme", "");

    const promises = files.map(async (file) => {
        const path = file.path;
        const download_url = file.download_url;
        const contents = await getGitHubFileData(download_url);

        zip.file(path, contents);
    });

    await Promise.all(promises);

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