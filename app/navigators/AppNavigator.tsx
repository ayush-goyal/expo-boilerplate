import { createNativeStackNavigator } from "@react-navigation/native-stack";

import * as Screens from "@/screens";
import { useAppTheme } from "@/utils/useAppTheme";

import Config from "../config";
import { RootStackParamList } from "./NavigationTypes";
import { useBackButtonHandler } from "./navigationUtilities";

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes;

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  useBackButtonHandler((routeName) => exitRoutes.includes(routeName));

  const {
    theme: { colors },
  } = useAppTheme();

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <RootStack.Screen name="Welcome" component={Screens.WelcomeScreen} />
    </RootStack.Navigator>
  );
};
