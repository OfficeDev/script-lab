export interface IProcessLibrariesResult {
    linkReferences: string[];
    scriptReferences: string[];
    dtsTypesReferences: string[];
    dtsFileReferences: string[];
    officeJs: string | null
}
export default function processLibraries(
    libraries: string,
    isInsideOffice: boolean,
): IProcessLibrariesResult {
    const linkReferences: string[] = [];
    const scriptReferences: string[] = [];
    const dtsTypesReferences: string[] = [];
    const dtsFileReferences: string[] = [];
    let officeJs: string | null = null;

    libraries.split('\n').forEach(processLibrary);

    if (!isInsideOffice) {
        officeJs = null;
    }

    return { linkReferences, scriptReferences, dtsTypesReferences, dtsFileReferences, officeJs };

    function processLibrary(text: string) {
        if (text == null) {
            return null;
        }

        text = text.trim();

        if (text === '' || text.startsWith('#') || text.startsWith('//')) {
            return null;
        }

        // dt~ is a special case that is not longer supported. 
        const isDefinitelyTypedReference = /^@types/.test(text);
        const isTypeFileReference = /\.d\.ts$/i.test(text)
        const isDts = isDefinitelyTypedReference || isTypeFileReference || /^dt~/.test(text);

        // @types package
        // .d.ts file which needs to be pulled and put into an @types folder

        if (isDefinitelyTypedReference) {
            dtsTypesReferences.push(text);
        }

        if (isTypeFileReference) {
            dtsFileReferences.push(text);
        }

        if (isDts) {
            return;
        }

        const resolvedUrlPath = /^https?:\/\/|^ftp? :\/\//i.test(text)
            ? text
            : `https://unpkg.com/${text}`;

        if (/\.css$/i.test(resolvedUrlPath)) {
            return linkReferences.push(resolvedUrlPath);
        }

        if (/\.ts$|\.js$/i.test(resolvedUrlPath)) {
            /*
             * Don't add Office.js to the rest of the script references --
             * it is special because of how it needs to be *outside* of the iframe,
             * whereas the rest of the script references need to be inside the iframe.
             */
            const officeJsRegex = /.*office(\.(experimental))?(\.debug)?\.js$/;
            /* captures:
                https://office.js
                https://office.debug.js
                https://office.experimental.js
                https://office.experimental.debug.js
              fails on:
                https://office.fooooo.debug.js
                https://officedebug.js
                https://officeydebug.js
            */
            if (officeJsRegex.test(resolvedUrlPath.toLowerCase())) {
                officeJs = resolvedUrlPath;
                return null;
            }

            return scriptReferences.push(resolvedUrlPath);
        }

        return scriptReferences.push(resolvedUrlPath);
    }
}
