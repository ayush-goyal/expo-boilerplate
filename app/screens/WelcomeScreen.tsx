import { FC } from "react";
import { View, SafeAreaView } from "react-native";

import StyledText from "@/components/StyledText";
import { RootStackScreenProps } from "@/navigators/NavigationTypes";

import { useSafeAreaInsetsStyle } from "../hooks/useSafeAreaInsetsStyle";

interface WelcomeScreenProps extends RootStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = () => {
  const insets = useSafeAreaInsetsStyle(["top", "bottom"]);

  return (
    <SafeAreaView style={insets} className="flex-1">
      <View className="flex-1 justify-center items-center">
        <StyledText className="text-2xl font-bold">Hello world</StyledText>
      </View>
    </SafeAreaView>
  );
};
