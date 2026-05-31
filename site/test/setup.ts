import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';

class MemoryStorage implements Storage {
  private readonly items = new Map<string, string>();

  get length() {
    return this.items.size;
  }

  clear() {
    this.items.clear();
  }

  getItem(key: string) {
    return this.items.get(String(key)) ?? null;
  }

  key(index: number) {
    return Array.from(this.items.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.items.delete(String(key));
  }

  setItem(key: string, value: string) {
    this.items.set(String(key), String(value));
  }
}

function isUsableStorage(storage: Storage | undefined): storage is Storage {
  return (
    Boolean(storage) &&
    typeof storage?.clear === 'function' &&
    typeof storage?.getItem === 'function' &&
    typeof storage?.setItem === 'function'
  );
}

function installStorage(name: 'localStorage' | 'sessionStorage') {
  if (isUsableStorage(globalThis[name])) return;

  Object.defineProperty(globalThis, name, {
    configurable: true,
    value: new MemoryStorage(),
    writable: true,
  });
}

beforeEach(() => {
  installStorage('localStorage');
  installStorage('sessionStorage');
  globalThis.localStorage.clear();
  globalThis.sessionStorage.clear();
});
