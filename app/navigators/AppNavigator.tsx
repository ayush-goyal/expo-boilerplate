import { createNativeStackNavigator } from "@react-navigation/native-stack";

import * as Screens from "@/screens";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { House } from "lucide-react-native";

import Config from "../config";
import { HomeTabStackParamList, MainTabsParamList, RootStackParamList } from "./NavigationTypes";
import { useBackButtonHandler } from "./navigationUtilities";
import { useMemo } from "react";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/contexts/ThemeContext";

const HomeTabStack = createNativeStackNavigator<HomeTabStackParamList>();
const HomeTabStackNavigator = () => {
  const themeColors = useThemeColors();
  return (
    <HomeTabStack.Navigator
      screenOptions={{
        headerShown: false,
        headerTintColor: themeColors.text,
        headerStyle: { backgroundColor: themeColors.background },
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <HomeTabStack.Screen name="Welcome" component={Screens.WelcomeScreen} />
    </HomeTabStack.Navigator>
  );
};

const MainTabs = createBottomTabNavigator<MainTabsParamList>();
const MainTabsNavigator = () => {
  const themeColors = useThemeColors();
  const tabScreenOptions = useMemo<BottomTabNavigationOptions>(
    () => ({
      headerShown: false,
      tabBarActiveTintColor: themeColors.primary,
      tabBarInactiveTintColor: themeColors.textMuted,
      tabBarShowLabel: true,
      tabBarLabelStyle: {
        fontSize: 11,
      },
      tabBarStyle: {
        backgroundColor: themeColors.background,
      },
      tabBarItemStyle: {
        paddingVertical: 8,
      },
      tabBarButton: (props) => (
        <Pressable
          {...props}
          style={[props.style, { paddingBottom: 0 }]}
          onPress={(event) => {
            props.onPress?.(event);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          }}
        />
      ),
    }),
    [themeColors]
  );

  return (
    <MainTabs.Navigator screenOptions={tabScreenOptions}>
      <MainTabs.Screen
        name="HomeTab"
        component={HomeTabStackNavigator}
        options={{
          tabBarIcon: ({ color }) => <House size={24} color={color} />,
          tabBarLabel: "Home",
        }}
      />
    </MainTabs.Navigator>
  );
};

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes;

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  useBackButtonHandler((routeName) => exitRoutes.includes(routeName));
  const themeColors = useThemeColors();

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: themeColors.background,
        contentStyle: {
          backgroundColor: themeColors.background,
        },
      }}
    >
      <RootStack.Screen name="MainTabs" component={MainTabsNavigator} />
    </RootStack.Navigator>
  );
};
