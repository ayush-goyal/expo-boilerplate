import { FC } from "react";
import { View, Text, SafeAreaView } from "react-native";

import { RootStackScreenProps } from "@/navigators/NavigationTypes";

import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle";

interface WelcomeScreenProps extends RootStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = () => {
  const insets = useSafeAreaInsetsStyle(["top", "bottom"]);

  return (
    <SafeAreaView style={insets} className="flex-1">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold">Welcome</Text>
      </View>
    </SafeAreaView>
  );
};
