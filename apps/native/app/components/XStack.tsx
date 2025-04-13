import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

interface Props {
  /**
   * The style to apply to the stack.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * The class name to apply to the stack.
   */
  className?: string;
}

export default function XStack(props: PropsWithChildren<Props>) {
  return (
    <View style={props.style} className="flex-row">
      {props.children}
    </View>
  );
}
