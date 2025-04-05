import { observer } from "mobx-react-lite";
import { FC } from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { AppStackScreenProps } from "../navigators";
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle";
import { useAppTheme } from "@/utils/useAppTheme";

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen() {
  const insets = useSafeAreaInsetsStyle(["top", "bottom"]);
  const { themed } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, insets]}>
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>Welcome</Text>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
