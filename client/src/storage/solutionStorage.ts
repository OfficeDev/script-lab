import StorageBase from './storagebase';

// 'any' should be the format of the solution - what is that?
export default class SolutionStorage extends StorageBase<any> {
    static instance() {
        const inst = new SolutionStorage();
        SolutionStorage.instance = () => inst;
        // and for the dev-friendly thing in the interim, here we do like:
        (window as any).clearSolutions = () => inst.clear();
        return inst;
    }
    constructor(maxSize?: number) {
        // I dunno ... 3MB by default?
        super('solution', maxSize || 3072 * 1024 * 1024);
    }

    protected doStorageWrite(key: string, value: string): void {
        localStorage.setItem(key, value);
    }
    protected doStorageRemove(key: string) {
        localStorage.removeItem(key);
    }
    protected doStorageValueOf() {
        return localStorage.valueOf();
    }
}