import React from "react";
import { Text, useFont } from "@shopify/react-native-skia";
import { colors } from "@/constants/colors";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

interface Props {
  x: number;
  y: number;
  value: SharedValue<number>;
  progress: SharedValue<number>;
}

const ValueText = ({ x, y, progress, value }: Props) => {
  const font = useFont(require("@/assets/fonts/Poppins-SemiBold.ttf"));

  const text = useDerivedValue(() => {
    return String(Math.trunc(value.value * progress.value));
  });

  const textY = useDerivedValue(() => 320 + y * progress.value * -1);

  const textX = useDerivedValue(() => {
    return x - font?.measureText(text.value).width! / 2;
  });

  if (!font) {
    return null;
  }

  return (
    <Text
      color={colors.gray[100]}
      font={font}
      x={textX}
      y={textY}
      text={text}
    />
  );
};

export default ValueText;
