import { Text, TextProps } from "react-native";

const DEFAULT_FONT_FAMILY = "SpaceGrotesk";

const StyledText = ({ children, ...props }: TextProps) => {
  return (
    <Text style={{ fontFamily: DEFAULT_FONT_FAMILY }} {...props}>
      {children}
    </Text>
  );
};

export default StyledText;
