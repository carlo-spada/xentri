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

    // @ts-expect-error test stub
    global.document = {
      documentElement: {
        classList: createClassList(classStorage),
      },
    };

    // @ts-expect-error test stub
    global.localStorage = localStorageMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // @ts-expect-error cleanup stubs
    delete global.document;
    // @ts-expect-error cleanup stubs
    delete global.localStorage;
    // @ts-expect-error cleanup stubs
    delete global.fetch;
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
    // @ts-expect-error test stub
    global.fetch = vi.fn().mockResolvedValue(response);

    await hydrateThemeFromServer();

    expect($themePreference.get()).toBe('dark');
    expect(localStorageMock.getItem('xentri-theme')).toBe('dark');
    expect(classStorage.has('dark')).toBe(true);
  });

  it('applyTheme is a no-op without document', () => {
    // @ts-expect-error cleanup document for this test
    delete global.document;
    expect(() => applyTheme('dark')).not.toThrow();
  });
});
