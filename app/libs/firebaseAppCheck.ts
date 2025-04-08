import appCheck from "@react-native-firebase/app-check";

const appCheckProvider = appCheck().newReactNativeFirebaseAppCheckProvider();
appCheckProvider.configure({
  android: {
    provider: __DEV__ ? "debug" : "playIntegrity",
  },
  apple: {
    provider: __DEV__ ? "debug" : "appAttestWithDeviceCheckFallback",
  },
});
appCheck().initializeAppCheck({
  provider: appCheckProvider,
  isTokenAutoRefreshEnabled: true,
});

const checkAppCheckInit = async () => {
  try {
    const { token } = await appCheck().getToken(true);

    if (token.length > 0) {
      console.log("AppCheck verification passed");
    }
  } catch (error) {
    console.warn("AppCheck verification failed", error);
  }
};
if (__DEV__) checkAppCheckInit();
