import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ComponentProps } from "react";

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
};
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type HomeTabStackParamList = {
  Welcome: undefined;
};
export type HomeTabStackScreenProps<T extends keyof HomeTabStackParamList> = CompositeScreenProps<
  BottomTabScreenProps<HomeTabStackParamList, T>,
  MainTabsScreenProps<keyof MainTabsParamList>
>;

export type MainTabsParamList = {
  HomeTab: undefined;
};
export type MainTabsScreenProps<T extends keyof MainTabsParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export interface NavigationProps
  extends Partial<ComponentProps<typeof NavigationContainer<RootStackParamList>>> {}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
