
interface IStorageEntry {
    data: string;
    lastWrite: number;
}

export default abstract class StorageBase<T> {
    private static readonly STORAGELIMIT = 5000000;
    private rootKey: string;
    private maxSpace: number;
    private allValues: { [key: string]: IStorageEntry };

    constructor(rootKey: string, maxSpace?: number) {
        // optional - cap the upper end of maxSpace
        if (!rootKey) {
            throw new Error("Invalid param");
        } else if (maxSpace && maxSpace > StorageBase.STORAGELIMIT) {
            throw new Error("Local storage doesn't have that much space.");
        }
        this.rootKey = rootKey + ".";
        this.maxSpace = maxSpace || StorageBase.STORAGELIMIT;
    }
    // returns all the keys in public shortened form
    // like 'guid' instead of 'solution.guid'
    keys(): string[] {
        this.ensureInitialized();
        const keys = Object.keys(this.allValues);
        const rootLength = this.rootKey.length;
        return keys.map(key => key.substring(rootLength));
    }
    readAll(): T[] {
        const allKeys = this.keys();
        return allKeys.map(key => this.read(key));
    }
    read(key: string): T {
        this.ensureInitialized();
        const fullKey = this.fullKey(key);
        const entry = this.allValues[fullKey];
        if (!entry) {
            throw new Error(`No entry found for ${fullKey}`);
        } else {
            return JSON.parse(entry.data);
        }
    }
    write(key: string, data: T): void {
        this.ensureInitialized();
        const fullKey = this.fullKey(key);
        const newEntry: IStorageEntry = { data: JSON.stringify(data), lastWrite: Date.now() };
        this.allValues[fullKey] = newEntry;
        while (this.totalSize() > this.maxSpace) {
            const deleteKey = this.findLeastValuable();
            this.removeKey(deleteKey);
        }
        try { // try/catch because setItem will throw if we exceed the storage quota
            this.doStorageWrite(fullKey, JSON.stringify(newEntry));
        } catch (e) {
            delete this.allValues[fullKey];
        }
    }
    clear() {
        const keys = Object.keys(this.allValues);
        keys.forEach(key => {
            this.removeKey(this.fullKey(key));
        })
    }

    // right now this just finds the oldest
    // we can rewrite this to be whatever, or an extending class can overwrite it
    protected findLeastValuable(): string {
        const keys = Object.keys(this.allValues);
        let oldestKey = keys[0];
        let oldest = Date.now();
        keys.forEach(key => {
            const entry = this.allValues[key];
            if (entry.lastWrite < oldest) {
                oldest = entry.lastWrite;
                oldestKey = key;
            }
        });
        return oldestKey;
    }
    // tested this with a variety of loads. The major cost is the JSON parsing.
    // When approaching the 5MB limit of most browsers, the total time spent
    // on parsing runs around 40-50ms. 
    // A single entry of serialized size takes about:
    //     10k:  0ms
    //    100k:  1ms
    //   1000k:  8ms
    //   2000k: 15ms
    // Times are approximately equivalent for reads and writes.
    private readAllInternal(): { [key: string]: IStorageEntry } {
        const now = Date.now();
        const myValues: { [key: string]: IStorageEntry } = {};
        const lsValues = this.doStorageValueOf();
        const lsKeys = Object.keys(lsValues);
        const myKeys = lsKeys.filter((val: string) => {
            return val.indexOf(this.rootKey) === 0;
        });
        myKeys.forEach(key => {
            try {
                const entry: IStorageEntry = JSON.parse(lsValues[key]);
                myValues[key] = entry;
            } catch (e) {
                // if we can't read back the value, it's corrupt - toss it
                this.doStorageRemove(key);
            }
        });
        return myValues;
    };
    private fullKey(key: string): string {
        return this.rootKey + key;
    }
    private removeKey(fullKey: string): void {
        this.doStorageRemove(fullKey);
        delete this.allValues[fullKey];
    }
    private ensureInitialized(): void {
        if (this.allValues) { return; }
        this.allValues = this.readAllInternal();
    }
    private totalSize(): number {
        const keys = Object.keys(this.allValues);
        let size = 0;
        keys.forEach(key => {
            size += this.allValues[key].data.length;
        });
        return size;
    };

    // hooks for testing - these would be implemented as localStorage.setItem, getItem, valueOf
    protected abstract doStorageWrite(key: string, value: string): void;
    protected abstract doStorageRemove(key: string): void;
    protected abstract doStorageValueOf(): any;
}


