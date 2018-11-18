interface ISnippet {
    id: string;
    gist?: string;
    gistOwnerId?: string;
    name: string;
    description?: string;
    /** author: export-only */
    author?: string;
    host: string;
    /** api_set: export-only (+ check at first level of import) */
    api_set?: {
        [index: string]: number;
    };
    order?: number;
    script: IContentLanguagePair;
    template: IContentLanguagePair;
    style: IContentLanguagePair;
    libraries: string;
}
interface IContentLanguagePair {
    content: string;
    language: string;
}
