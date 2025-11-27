import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import {
  $themePreference,
  applyTheme,
  hydrateThemeFromServer,
  setTheme,
} from './theme';

type ClassList = {
  add: (cls: string) => void;
  remove: (cls: string) => void;
  contains: (cls: string) => boolean;
};

const createClassList = (storage: Set<string>): ClassList => ({
  add: (cls: string) => storage.add(cls),
  remove: (cls: string) => storage.delete(cls),
  contains: (cls: string) => storage.has(cls),
});

const createLocalStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
    _store: store,
  };
};

describe('theme store', () => {
  let classStorage: Set<string>;
  let localStorageMock: ReturnType<typeof createLocalStorage>;

  beforeEach(() => {
    classStorage = new Set();
    localStorageMock = createLocalStorage();

    global.document = {
      documentElement: {
        classList: createClassList(classStorage),
      },
    } as unknown as Document;

    global.localStorage = localStorageMock as unknown as Storage;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (global as any).document;
    delete (global as any).localStorage;
    delete (global as any).fetch;
  });

  it('sets theme and persists locally without server call', async () => {
    const fetchSpy = vi.spyOn(globalThis as any, 'fetch');

    await setTheme('light', false);

    expect($themePreference.get()).toBe('light');
    expect(classStorage.has('light')).toBe(true);
    expect(localStorageMock.getItem('xentri-theme')).toBe('light');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('hydrates theme from server response and applies it', async () => {
    const response = {
      ok: true,
      json: async () => ({ preferences: { theme: 'dark' } }),
    };
    global.fetch = vi.fn().mockResolvedValue(response) as unknown as typeof fetch;

    await hydrateThemeFromServer();

    expect($themePreference.get()).toBe('dark');
    expect(localStorageMock.getItem('xentri-theme')).toBe('dark');
    expect(classStorage.has('dark')).toBe(true);
  });

  it('applyTheme is a no-op without document', () => {
    delete (global as any).document;
    expect(() => applyTheme('dark')).not.toThrow();
  });
});
