// https://medium.com/@salvinodsa/typeorm-to-mikroorm-my-journey-through-the-migration-process-3d7b57a9c481

/* eslint-disable @typescript-eslint/no-unsafe-return */

jest.mock('@mikro-orm/core', () => ({
  ...jest.requireActual('@mikro-orm/core'),
  Collection: class<T> {
    private items: T[];

    constructor(items: T[] = []) {
      this.items = items;
    }

    getItems() {
      return this.items;
    }

    count() {
      return this.items.length;
    }

    toArray() {
      return [...this.items];
    }

    add(item: T) {
      if (!this.contains(item)) {
        this.items.push(item);
      }
    }

    remove(item: T) {
      this.items = this.items.filter((i) => i !== item);
    }

    // Sets the entire collection to the new array of items.
    set(items: T[]) {
      this.items = items;
    }

    // Checks if the collection contains the given item.
    contains(item: T): boolean {
      return this.items.includes(item);
    }
  },
}));
