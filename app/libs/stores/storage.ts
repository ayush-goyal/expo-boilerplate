import { enableMapSet } from "immer";
import { MMKV } from "react-native-mmkv";
import superjson from "superjson";
import { PersistStorage } from "zustand/middleware";

// Enable MapSet plugin for Immer
enableMapSet();

// Function to create storage with custom ID
export const createStorage = (id: string): PersistStorage<any> => {
  const storage = new MMKV({
    id,
  });

  return {
    setItem: (name: string, value: any) => {
      storage.set(name, superjson.stringify(value));
    },
    getItem: (name: string) => {
      const value = storage.getString(name);
      return value ? superjson.parse(value) : null;
    },
    removeItem: (name: string) => {
      storage.delete(name);
    },
  };
};

// Default shared zustand storage instance
export const zustandStorage = createStorage("app-storage");
