// A little utility to handle storing key-value pairs.
// Found this to be very useful in other projects.
export default class ObjectStore<Tvalue> {
  private store: { [key: string]: Tvalue };
  constructor() {
    this.store = {};
  }

  create(key: string, value: Tvalue): boolean {
    if (this.store[key]) {
      return false;
    }
    this.store[key] = value;
    return true;
  }

  read(key: string): Tvalue {
    if (this.store[key] !== undefined) {
      return this.store[key];
    }
    throw new Error('No such item: ' + JSON.stringify(key));
  }

  keyExists(key: string): boolean {
    if (this.store[key] !== undefined) {
      return true;
    }
    return false;
  }

  delete(key: string): boolean {
    const ret = !!this.store[key];
    delete this.store[key];
    return ret;
  }

  keys(): string[] {
    return Object.keys(this.store);
  }

  values(): Tvalue[] {
    return Object.keys(this.store).map(key => this.store[key]);
  }
}
