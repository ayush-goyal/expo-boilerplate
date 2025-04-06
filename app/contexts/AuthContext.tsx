import { getMessaging } from "@react-native-firebase/messaging";
import { Session } from "@supabase/supabase-js";
import { usePostHog } from "posthog-react-native";
import { createContext, useContext, useEffect, useState } from "react";
import Purchases from "react-native-purchases";

import { useAppStore } from "@/libs/stores/app-store";
import { supabase } from "@/libs/supabase";

const messaging = getMessaging();

type AuthContextType = {
  session: Session | null;
  isInitializing: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const posthog = usePostHog();

  const resetAppStore = useAppStore((state) => state.reset);
  const clearAllStores = () => {
    resetAppStore();
  };

  useEffect(() => {
    // Check if there's an existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      // If no session exists, sign in anonymously
      if (!session) {
        try {
          const { error } = await supabase.auth.signInAnonymously();
          if (error) throw error;
        } catch (error) {
          console.error("Error signing in anonymously:", error);
        }
      } else {
        setSession(session);
      }
      setIsInitializing(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      posthog.identify(session?.user?.id);
      console.log("Supabase User Id:", session?.user?.id);
      console.log("Supabase Auth Token:", session?.access_token);

      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      await messaging.deleteToken();
      posthog.reset();

      // Clear all stores after successful sign out
      clearAllStores();
      try {
        await Purchases.logOut();
      } catch (error) {
        console.error("Error logging out of RevenueCat:", error);
      }
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, isInitializing, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
