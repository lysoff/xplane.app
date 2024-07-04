import React from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { Path, Skia } from "@shopify/react-native-skia";
import { colors } from "@/constants/colors";

interface Props {
  x: number;
  y: number;
  barWidth: number;
  graphHeight: number;
  progress: SharedValue<number>;
}

const BarPath = ({ x, y, graphHeight, barWidth, progress }: Props) => {
  const path = useDerivedValue(() => {
    const barPath = Skia.Path.Make();
    barPath.addRRect({
      rect: {
        x: x! - barWidth / 2,
        y: graphHeight,
        width: barWidth,
        height: y * -1 * progress.value,
      },
      rx: 8,
      ry: 8,
    });

    return barPath;
  });

  return <Path path={path} color={colors.secondary[200]} />;
};

export default BarPath;
