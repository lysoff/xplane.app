import { colors } from "@/constants/colors";
import React from "react";
import { Circle, G } from "react-native-svg";

import GlobeSvg from "@/assets/icons/globe.svg";
import HammerSvg from "@/assets/icons/hammer.svg";
import Grid from "@/assets/icons/grid.svg";
import { GestureResponderEvent } from "react-native";

const Icons = [GlobeSvg, HammerSvg, Grid];

interface ScorePointProps {
  item: any;
  x: number;
  y: number;
  onPress: (item: any) => void;
  selected: boolean;
}

const ScorePoint = ({ item, x, y, onPress, selected }: ScorePointProps) => {
  const IconComponent = Icons[item.iconIndex];

  const handlePress = (e: GestureResponderEvent) => {
    onPress(item);
  };

  const stroke = selected ? colors.gray[100] : colors.secondary.DEFAULT;

  return (
    <G onPress={handlePress} x={x} y={y}>
      <Circle cx={0} cy={0} r={15} stroke={stroke} fill={colors.primary} />
      <G x={-12} y={-12}>
        <IconComponent textAnchor="middle" stroke={stroke} />
      </G>
    </G>
  );
};

export default ScorePoint;
