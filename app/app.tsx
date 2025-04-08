import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { PostHogProvider } from "posthog-react-native";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
  initialWindowMetrics,
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import Config from "./config";
import { initI18n } from "./i18n";
import { AppNavigator, navigationRef, useNavigationPersistence } from "./navigators";
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary";
import { customFontsToLoad } from "./theme";
import { loadDateFnsLocale } from "./utils/formatDate";
import "../global.css";
import { AuthProvider } from "./contexts/AuthContext";
import { RevenueCatProvider, useRevenueCat } from "./contexts/RevenueCatContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { TrpcProvider } from "./contexts/TRPCContext";
import { useThemeProvider } from "./utils/useAppTheme";
import { useToastConfig } from "./libs/hooks/useToastConfig";
import "./libs/firebaseAppCheck";

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE";
SplashScreen.preventAutoHideAsync();

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const toastConfig = useToastConfig();
  const insets = useSafeAreaInsets();

  const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad);
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
    if (isI18nInitialized && (areFontsLoaded || fontLoadError) && !isRevenueCatLoading) {
      SplashScreen.hideAsync();
    }
  }, [isI18nInitialized, areFontsLoaded, fontLoadError, isRevenueCatLoading]);

  return (
    <>
      {children}
      <Toast config={toastConfig} topOffset={insets.top} />
    </>
  );
};

export function App() {
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(NAVIGATION_PERSISTENCE_KEY);

  const { themeScheme, navigationTheme, setThemeContextOverride, ThemeProvider } =
    useThemeProvider();

  // TODO: Refactor this to be hidden later
  if (!isNavigationStateRestored) {
    return null;
  }

  return (
    <ErrorBoundary catchErrors={Config.catchErrors}>
      <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
        <NavigationContainer
          ref={navigationRef}
          theme={navigationTheme}
          initialState={initialNavigationState}
          onStateChange={onNavigationStateChange}
        >
          <PostHogProvider
            apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY ?? " "}
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
          </PostHogProvider>
        </NavigationContainer>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
