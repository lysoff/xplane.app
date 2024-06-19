import { colors } from "@/constants/colors";
import React from "react";
import { Circle, G, SvgProps } from "react-native-svg";

import GlobeSvg from "@/assets/icons/globe.svg";
import HammerSvg from "@/assets/icons/hammer.svg";
import Grid from "@/assets/icons/grid.svg";
import { GestureResponderEvent } from "react-native";

export type FieldType = "globe" | "hammer" | "grid";

export const Icons: Record<FieldType, React.FC<SvgProps>> = {
  globe: GlobeSvg,
  hammer: HammerSvg,
  grid: Grid,
};

interface ScorePointProps {
  field?: FieldType;
  timestamp: Date;
  x: number;
  y: number;
  onPress: (item: any) => void;
  selected: boolean;
}

const ScorePoint = ({
  field,
  x,
  y,
  onPress,
  selected,
  timestamp,
}: ScorePointProps) => {
  const IconComponent = field ? Icons[field] : null;

  const handlePress = (e: GestureResponderEvent) => {
    onPress({
      field,
      timestamp,
    });
  };

  const stroke = selected ? colors.gray[100] : colors.secondary.DEFAULT;

  return (
    <G onPress={handlePress} x={x} y={y}>
      <Circle
        cx={0}
        cy={0}
        r={15}
        stroke={stroke}
        fillOpacity={0.8}
        fill={colors.primary}
      />
      <G x={-12} y={-12}>
        {IconComponent ? (
          <IconComponent textAnchor="middle" stroke={stroke} />
        ) : null}
      </G>
    </G>
  );
};

export default ScorePoint;
