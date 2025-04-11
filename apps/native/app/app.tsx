import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
  initialWindowMetrics,
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { PostHogProvider } from "posthog-react-native";

import Config from "./config";
import { initI18n } from "./i18n";
import { AppNavigator, navigationRef, useNavigationPersistence } from "./navigators";
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary";
import { loadDateFnsLocale } from "./utils/formatDate";

import "../global.css";

import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { RevenueCatProvider, useRevenueCat } from "./contexts/RevenueCatContext";
import { TrpcProvider } from "./contexts/TRPCContext";
import { useToastConfig } from "./hooks/useToastConfig";

import "./libs/firebase-app-check";

import { useColorScheme } from "react-native";

import { ThemeProvider } from "./contexts/ThemeContext";

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE";
SplashScreen.preventAutoHideAsync();

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(NAVIGATION_PERSISTENCE_KEY);
  const theme = useColorScheme();
  const toastConfig = useToastConfig();
  const insets = useSafeAreaInsets();

  const [areFontsLoaded, fontLoadError] = useFonts({});
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);
  const { isLoading: isRevenueCatLoading } = useRevenueCat();

  useEffect(() => {
    initI18n()
      .then(() => {
        setIsI18nInitialized(true);
      })
      .then(() => {
        loadDateFnsLocale();
      });
  }, []);

  useEffect(() => {
    if (
      isI18nInitialized &&
      (areFontsLoaded || fontLoadError) &&
      !isRevenueCatLoading &&
      isNavigationStateRestored
    ) {
      SplashScreen.hideAsync();
    }
  }, [
    isI18nInitialized,
    areFontsLoaded,
    fontLoadError,
    isRevenueCatLoading,
    isNavigationStateRestored,
  ]);

  if (!isNavigationStateRestored) {
    return null;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={theme === "dark" ? DarkTheme : DefaultTheme}
      initialState={initialNavigationState}
      onStateChange={onNavigationStateChange}
    >
      <PostHogProvider
        apiKey={Config.POSTHOG_API_KEY}
        options={{
          host: "https://us.i.posthog.com",
          disabled: __DEV__,
        }}
        autocapture={{
          captureTouches: false,
          captureLifecycleEvents: true,
          captureScreens: true,
          customLabelProp: "ph-label",
          noCaptureProp: "ph-no-capture",
        }}
      >
        {children}
        <Toast config={toastConfig} topOffset={insets.top} />
      </PostHogProvider>
    </NavigationContainer>
  );
};

export function App() {
  return (
    <ErrorBoundary catchErrors={Config.catchErrors}>
      <ThemeProvider>
        <AuthProvider>
          <RevenueCatProvider>
            <TrpcProvider>
              <NotificationProvider>
                <GestureHandlerRootView>
                  <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                    <KeyboardProvider>
                      <AppWrapper>
                        <AppNavigator />
                      </AppWrapper>
                    </KeyboardProvider>
                  </SafeAreaProvider>
                </GestureHandlerRootView>
              </NotificationProvider>
            </TrpcProvider>
          </RevenueCatProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
