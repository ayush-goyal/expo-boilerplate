import { FC } from "react";
import { SafeAreaView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";

import StyledText from "@/components/StyledText";
import { useTRPC } from "@/libs/trpc";
import { HomeTabStackScreenProps } from "@/navigators/NavigationTypes";
import { useSafeAreaInsetsStyle } from "../hooks/useSafeAreaInsetsStyle";

interface WelcomeScreenProps extends HomeTabStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = () => {
  const insets = useSafeAreaInsetsStyle(["top", "bottom"]);
  const trpc = useTRPC();
  const { data } = useQuery({
    ...trpc.getUserCount.queryOptions(),
    gcTime: 0,
    staleTime: 0,
  });

  return (
    <SafeAreaView style={insets} className="flex-1">
      <View className="flex-1 items-center justify-center gap-4">
        <StyledText className="text-2xl font-bold">Hello world</StyledText>
        <StyledText className="text-lg">Total Users: {data}</StyledText>
      </View>
    </SafeAreaView>
  );
};
