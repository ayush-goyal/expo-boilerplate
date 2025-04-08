import { FirebaseAuthTypes, getAuth, PhoneAuthProvider } from "@react-native-firebase/auth";
import { getMessaging } from "@react-native-firebase/messaging";
import { usePostHog } from "posthog-react-native";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Purchases from "react-native-purchases";

import { useAppStore } from "@/libs/stores/app-store";

const messaging = getMessaging();
const auth = getAuth();

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  isInitializing: boolean;
  signOut: () => Promise<void>;
  signInWithPhoneNumber: (phoneNumber: string, forceResend?: boolean) => Promise<void>;
  confirmVerificationCode: (verificationCode: string) => Promise<void>;
}

const initialState: AuthContextType = {
  user: null,
  isInitializing: true,
  signOut: async () => {},
  signInWithPhoneNumber: async () => {},
  confirmVerificationCode: async () => {},
};

const AuthContext = createContext<AuthContextType>(initialState);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [confirmationResult, setConfirmationResult] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const posthog = usePostHog();
  const resetAppStore = useAppStore((state) => state.reset);

  const clearAllStores = useCallback(() => {
    resetAppStore();
  }, [resetAppStore]);

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Get the token for logging
        const token = await firebaseUser.getIdToken();
        console.log("Firebase User Id:", firebaseUser.uid);
        console.log("Firebase Auth Token:", token);

        // Identify user in PostHog
        posthog.identify(firebaseUser.uid);
      } else {
        // If no user exists, sign in anonymously
        try {
          await auth.signInAnonymously();
        } catch (error) {
          console.error("Error signing in anonymously:", error);
        }
      }
      setIsInitializing(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithPhoneNumber = useCallback(async (phoneNumber: string, forceResend?: boolean) => {
    try {
      const result = await auth.signInWithPhoneNumber(phoneNumber, forceResend);
      setConfirmationResult(result);
    } catch (error) {
      console.error("Error during phone authentication:", error);
      throw error;
    }
  }, []);

  const confirmVerificationCode = useCallback(
    async (verificationCode: string) => {
      if (!confirmationResult) {
        throw new Error("No verification was sent. Please request a code first.");
      }

      try {
        // If user is anonymous, link the credential to the current user
        if (user?.isAnonymous) {
          const credential = PhoneAuthProvider.credential(
            confirmationResult.verificationId,
            verificationCode
          );
          await user.linkWithCredential(credential);
          console.log("Anonymous account successfully upgraded to phone auth");
        } else {
          // Otherwise just confirm the code normally
          await confirmationResult.confirm(verificationCode);
        }
      } catch (error) {
        console.error("Error confirming verification code:", error);
        throw error;
      }
    },
    [confirmationResult, user]
  );

  const signOut = useCallback(async () => {
    try {
      await auth.signOut();
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
  }, [clearAllStores, posthog]);

  const value = useMemo(
    () => ({
      user,
      isInitializing,
      signOut,
      signInWithPhoneNumber,
      confirmVerificationCode,
    }),
    [user, isInitializing, signOut, signInWithPhoneNumber, confirmVerificationCode]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
