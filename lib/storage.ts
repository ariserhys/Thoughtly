import { createMMKV, MMKV } from "react-native-mmkv";

export const storage: MMKV = createMMKV({
  id: "thoughtly-storage",
});

// Type-safe storage helpers
export const storageUtils = {
  getString: (key: string): string | undefined => {
    return storage.getString(key);
  },

  setString: (key: string, value: string): void => {
    storage.set(key, value);
  },

  getObject: <T>(key: string): T | undefined => {
    const value = storage.getString(key);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch {
        return undefined;
      }
    }
    return undefined;
  },

  setObject: <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
  },

  delete: (key: string): void => {
    storage.delete(key);
  },

  contains: (key: string): boolean => {
    return storage.contains(key);
  },

  clearAll: (): void => {
    storage.clearAll();
  },
};

export default storage;