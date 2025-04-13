import { PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

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

export default function YStack(props: PropsWithChildren<Props>) {
  return (
    <View style={props.style} className="flex">
      {props.children}
    </View>
  );
}
