import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { ErrorToast, SuccessToast, ToastConfig } from "react-native-toast-message";
import colors from "tailwindcss/colors";

import { themeColors } from "../colors";

export const useToastConfig = () => {
  const commonStyle: StyleProp<ViewStyle> = {
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 0,
    backgroundColor: themeColors.light.card,
    borderWidth: 1,
    borderColor: themeColors.light.border,
    height: "auto",
  };

  const commonTextStyleProps: {
    text1Style: StyleProp<TextStyle>;
    text2Style: StyleProp<TextStyle>;
  } = {
    text1Style: {
      fontSize: 15,
      fontWeight: "700",
      color: themeColors.light.text,
      letterSpacing: -0.3,
    },
    text2Style: {
      fontSize: 14,
      fontWeight: "400",
      color: themeColors.light.textMuted,
      letterSpacing: -0.2,
      marginTop: 2,
    },
  };

  const toastConfig: ToastConfig = {
    success: (props) => (
      <SuccessToast
        {...props}
        {...commonTextStyleProps}
        text2NumberOfLines={0}
        style={[
          commonStyle,
          {
            borderLeftColor: colors.green[600],
          },
        ]}
      />
    ),
    warning: (props) => (
      <SuccessToast
        {...props}
        {...commonTextStyleProps}
        text2NumberOfLines={0}
        style={[
          commonStyle,
          {
            borderLeftColor: colors.yellow[600],
          },
        ]}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        {...commonTextStyleProps}
        text2NumberOfLines={0}
        style={[
          commonStyle,
          {
            borderLeftColor: colors.red[600],
          },
        ]}
      />
    ),
  };

  return toastConfig;
};
