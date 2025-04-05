import { ErrorInfo } from "react";
import {
  ScrollView,
  TextStyle,
  View,
  ViewStyle,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { ThemedStyle } from "@/theme";
import { useAppTheme } from "@/utils/useAppTheme";

export interface ErrorDetailsProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  onReset(): void;
}

/**
 * Renders the error details screen.
 * @param {ErrorDetailsProps} props - The props for the `ErrorDetails` component.
 * @returns {JSX.Element} The rendered `ErrorDetails` component.
 */
export function ErrorDetails(props: ErrorDetailsProps) {
  const { themed } = useAppTheme();
  return (
    <SafeAreaView style={[styles.safeArea, themed($contentContainer)]}>
      <View style={$topSection}>
        <MaterialIcons name="bug-report" size={64} color="#FF0000" />
        <Text style={themed($heading)}>Something went wrong!</Text>
        <Text>We're sorry, but something went wrong. Please try again.</Text>
      </View>

      <ScrollView
        style={themed($errorSection)}
        contentContainerStyle={themed($errorSectionContentContainer)}
      >
        <Text style={themed($errorContent)}>{`${props.error}`.trim()}</Text>
        <Text selectable style={themed($errorBacktrace)}>
          {`${props.errorInfo?.componentStack ?? ""}`.trim()}
        </Text>
      </ScrollView>

      <TouchableOpacity style={themed($resetButton)} onPress={props.onReset}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
  },
});

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.xl,
  flex: 1,
});

const $topSection: ViewStyle = {
  flex: 1,
  alignItems: "center",
};

const $heading: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.error,
  marginBottom: spacing.md,
  fontSize: 18,
  fontWeight: "bold",
});

const $errorSection: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 2,
  backgroundColor: colors.separator,
  marginVertical: spacing.md,
  borderRadius: 6,
});

const $errorSectionContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
});

const $errorContent: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.error,
  fontWeight: "bold",
});

const $errorBacktrace: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  marginTop: spacing.md,
  color: colors.textDim,
});

const $resetButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.error,
  paddingHorizontal: spacing.xxl,
  borderRadius: 8,
  marginVertical: spacing.md,
  alignSelf: "center",
});
