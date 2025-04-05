import { observer } from "mobx-react-lite";
import { FC } from "react";
import { View, Text, SafeAreaView } from "react-native";

import { useAppTheme } from "@/utils/useAppTheme";

import { AppStackScreenProps } from "../navigators";
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle";

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen() {
  const insets = useSafeAreaInsetsStyle(["top", "bottom"]);
  const { themed } = useAppTheme();

  return (
    <SafeAreaView style={insets} className="flex-1">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold">Welcome</Text>
      </View>
    </SafeAreaView>
  );
});
