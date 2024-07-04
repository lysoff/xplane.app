import React from "react";
import { Text, useFont } from "@shopify/react-native-skia";
import { colors } from "@/constants/colors";

interface Props {
  x: number;
  y: number;
  text: string;
}

const XAxisText = ({ x, y, text }: Props) => {
  const font = useFont(require("@/assets/fonts/Poppins-SemiBold.ttf"));

  if (!font) {
    return null;
  }

  const textX = x - font?.measureText(text).width! / 2;

  return (
    <Text color={colors.gray[100]} font={font} x={textX} y={y} text={text} />
  );
};

export default XAxisText;
