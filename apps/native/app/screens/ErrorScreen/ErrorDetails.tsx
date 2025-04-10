import { ErrorInfo } from "react";
import { ScrollView, View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { useThemeColors } from "@/contexts/ThemeContext";

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
  const colors = useThemeColors();

  return (
    <SafeAreaView className="flex-1 items-center px-6 pt-8">
      <View className="flex-1 items-center">
        <Text className="text-lg font-bold mb-4 text-accent">Something went wrong!</Text>
        <Text className="text-text">We're sorry, but something went wrong. Please try again.</Text>
      </View>

      <ScrollView
        className="flex-2 w-full my-4 rounded-lg bg-background-subtle"
        contentContainerClassName="p-4"
      >
        <Text className="font-bold text-accent">{`${props.error}`.trim()}</Text>
        <Text selectable className="mt-4 text-text-muted">
          {`${props.errorInfo?.componentStack ?? ""}`.trim()}
        </Text>
      </ScrollView>

      <TouchableOpacity
        className="bg-accent px-12 rounded-lg my-4 self-center"
        onPress={props.onReset}
      >
        <Text className="text-on-accent font-bold text-center py-2.5">Reset</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
