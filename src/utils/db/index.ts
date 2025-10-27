export interface Database<T> {
  get: (key: string) => Promise<T | null>;
  getAll: () => Promise<{ key: string; value: T }[]>;
  set: (key: string, value: T) => Promise<void>;
  remove: (key: string) => Promise<void>;
}

export class LocalStorageDatabase<T> implements Database<T> {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  async get(key: string): Promise<T | null> {
    const saveValue = localStorage.getItem(this.composeKey(key));

    this.log(`Got ${key}: ${saveValue}`);

    if (!saveValue) {
      return null;
    }

    return JSON.parse(saveValue);
  }

  async getAll(): Promise<{ key: string; value: T }[]> {
    const entries = await Promise.all(
      Object.keys(localStorage)
        .filter((key) => key.startsWith(this.name))
        .map(async (key) => {
          const value = await this.get(key.replace(`${this.name}_`, ''));

          return {
            key: key.replace(`${this.name}_`, ''),
            value: value,
          };
        })
    );

    this.log(`Got all entries: ${entries.length}`);

    return entries.filter((entry) => entry.value !== null) as {
      key: string;
      value: T;
    }[];
  }

  async set(key: string, value: T): Promise<void> {
    const preparedValue = JSON.stringify(value);

    localStorage.setItem(this.composeKey(key), preparedValue);

    this.log(`Saved ${key}: ${preparedValue}`);
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(this.composeKey(key));

    this.log(`Removed ${key}`);
  }

  // console.log wrapper
  private log(...message: any) {
    // console.log(`[LocalStorageDatabase "${this.name}"] ${message}`);
  }

  private composeKey(key: string): string {
    return `DB_${this.name}_${key}`;
  }
}
