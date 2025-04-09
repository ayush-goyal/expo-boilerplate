import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { createStorage } from "./storage";

interface AppStoreState {
  hasCompletedOnboarding: boolean;
}

interface AppStore extends AppStoreState {
  setHasCompletedOnboarding: (completed: boolean) => void;
  reset: () => void;
}

const initialState: AppStoreState = {
  hasCompletedOnboarding: false,
};

export const useAppStore = create<AppStore>()(
  immer(
    persist(
      (set) => ({
        ...initialState,

        setHasCompletedOnboarding: (completed) => {
          set((state) => {
            state.hasCompletedOnboarding = completed;
          });
        },

        reset: () => {
          set((state) => {
            Object.assign(state, initialState);
          });
        },
      }),
      {
        name: "app-storage",
        storage: createStorage("app-storage"),
      }
    )
  )
);
