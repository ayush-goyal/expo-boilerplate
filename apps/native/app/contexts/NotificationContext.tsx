import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  checkNotifications,
  PermissionStatus,
  requestNotifications,
  RESULTS,
} from "react-native-permissions";
import { useAppState } from "@react-native-community/hooks";
import { getMessaging } from "@react-native-firebase/messaging";
import { useMutation } from "@tanstack/react-query";

const messaging = getMessaging();

type NotificationContextType = {
  token: string | null;
  requestPermission: () => Promise<boolean>;
  syncDeviceTokenToServer: (fcmToken?: string) => Promise<void>;
  notificationPermission: PermissionStatus;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const appState = useAppState();
  const [token, setToken] = useState<string | null>(null);
  // TODO: Setup create device mutation
  const { mutate: createDeviceMutation }: any = useMutation({});
  const [notificationPermission, setNotificationPermission] = useState<PermissionStatus>(
    RESULTS.DENIED
  );

  const syncDeviceTokenToServer = useCallback(async () => {
    try {
      const fcmToken = await messaging.getToken();
      console.log("FCM token:", fcmToken);
      await createDeviceMutation.mutateAsync({
        fcmToken,
        platform: Platform.OS === "ios" ? "IOS" : "ANDROID",
      });
    } catch (error) {
      console.error("Error syncing device token:", error);
    }
  }, [createDeviceMutation]);

  useEffect(() => {
    (async () => {
      const { status } = await checkNotifications();
      setNotificationPermission(status);
    })();
  }, [appState]);

  const requestPermission = useCallback(async () => {
    try {
      const { status } = await checkNotifications();

      if (status === RESULTS.DENIED) {
        const { status: newStatus } = await requestNotifications(["alert", "sound", "badge"]);
        if (newStatus !== RESULTS.GRANTED) {
          return false;
        }
      } else if (status !== RESULTS.GRANTED) {
        return false;
      }

      // Get FCM token after permissions are granted
      const fcmToken = await messaging.getToken();
      console.log("FCM token:", fcmToken);
      setToken(fcmToken);
      await syncDeviceTokenToServer();

      return true;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }, [syncDeviceTokenToServer]);

  useEffect(() => {
    const unsubscribe = messaging.onTokenRefresh((newToken) => {
      setToken(newToken);
      syncDeviceTokenToServer();
    });

    const foregroundSubscription = messaging.onMessage(async (remoteMessage) => {
      // Handle foreground messages here
      console.log("Received foreground message:", remoteMessage);
    });

    messaging.onNotificationOpenedApp((remoteMessage) => {
      console.log("Notification opened app:", remoteMessage);
    });

    messaging.getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) {
        console.log("Initial notification:", remoteMessage);
      }
    });

    return () => {
      unsubscribe();
      foregroundSubscription();
    };
  }, [requestPermission, syncDeviceTokenToServer]);

  useEffect(() => {
    (async () => {
      const fcmToken = await messaging.getToken();
      console.log("FCM token:", fcmToken);
    })();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        token,
        requestPermission,
        syncDeviceTokenToServer,
        notificationPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
