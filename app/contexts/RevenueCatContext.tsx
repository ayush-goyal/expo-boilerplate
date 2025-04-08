import { useAppState } from "@react-native-community/hooks";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, { CustomerInfo, PurchasesPackage } from "react-native-purchases";

import { useAuth } from "./AuthContext";

type RevenueCatContextType = {
  customerInfo: CustomerInfo | null;
  isLoading: boolean;
  packages: PurchasesPackage[];
  restorePurchases: () => Promise<void>;
  isProMember: boolean;
  updateCustomerInfo: () => Promise<void>;
};

const RevenueCatContext = createContext<RevenueCatContextType | undefined>(undefined);

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const { user } = useAuth();
  const appState = useAppState();

  const isProMember = Boolean(customerInfo?.entitlements.active["Pro"]);

  useEffect(() => {
    initializeRevenueCat();
  }, []);

  useEffect(() => {
    (async () => {
      if (user && appState === "active") {
        await updateCustomerInfo();
        try {
          await Purchases.logIn(user.uid);
        } catch (error) {
          console.error("Error logging into RevenueCat:", error);
        }
      }
    })();
  }, [user, appState]);

  const initializeRevenueCat = async () => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_REVENUE_CAT_API_KEY;

      if (!apiKey) {
        console.log("RevenueCat API key not set, skipping initialization");
        setIsLoading(false);
        return;
      }

      if (Platform.OS === "ios") {
        Purchases.configure({
          apiKey,
        });
      }

      // Fetch available packages
      const offerings = await Purchases.getOfferings();
      console.log("offerings", offerings);
      if (offerings.current?.availablePackages) {
        setPackages(offerings.current.availablePackages);
      }

      await updateCustomerInfo();
      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing RevenueCat:", error);
      setIsLoading(false);
    }
  };

  const updateCustomerInfo = async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (error) {
      console.error("Error fetching customer info:", error);
    }
  };

  const restorePurchases = async () => {
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
    } catch (error) {
      console.error("Error restoring purchases:", error);
      throw error;
    }
  };

  return (
    <RevenueCatContext.Provider
      value={{
        customerInfo,
        isLoading,
        packages,
        restorePurchases,
        isProMember,
        updateCustomerInfo,
      }}
    >
      {children}
    </RevenueCatContext.Provider>
  );
}

export function useRevenueCat() {
  const context = useContext(RevenueCatContext);
  if (context === undefined) {
    throw new Error("useRevenueCat must be used within a RevenueCatProvider");
  }
  return context;
}
