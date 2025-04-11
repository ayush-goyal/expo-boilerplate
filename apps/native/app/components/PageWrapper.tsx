import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cn } from "@/libs/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  fullScreen?: boolean;
}

const PageWrapper = ({ children, className, fullScreen = false }: PageWrapperProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={cn("flex flex-1", className)}
      style={[
        {
          paddingBottom: insets.bottom + 8,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        !fullScreen && { paddingTop: insets.top },
      ]}
    >
      {children}
    </View>
  );
};

export default PageWrapper;
