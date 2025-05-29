import type { PropsWithChildren } from "react";
import { View } from "react-native";

import { cn } from "@/libs/utils";

interface Props {
  /**
   * The class name to apply to the stack.
   */
  className?: string;
}

export default function XStack(props: PropsWithChildren<Props>) {
  return <View className={cn("flex flex-row", props.className)}>{props.children}</View>;
}
