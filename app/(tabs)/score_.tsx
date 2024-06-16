import { SafeAreaView, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { randomTimestamps } from "@/utils/randomTimestamps";
import * as shape from "d3-shape";
import * as scale from "d3-scale";
import { G, Path, Svg, Text as SvgText } from "react-native-svg";
import { colors } from "@/constants/colors";
import { DateTime } from "luxon";
import Button from "@/components/Button";
import ScorePoint from "@/components/ScorePoint";
import AnimatedPath from "@/components/charts/AnimatedPath";

const curves = [
  shape.curveBumpX,
  shape.curveBumpY,
  shape.curveCardinal,
  shape.curveCatmullRom,
  shape.curveMonotoneX,
  shape.curveMonotoneY,
  shape.curveNatural,
  shape.curveStep,
  shape.curveStepAfter,
  shape.curveStepBefore,
];

const Score = () => {
  const _timestamps = useMemo(() => randomTimestamps(), []);
  const [timestamps, setTimestamps] = useState(_timestamps);

  const [curveIndex, setCurveIndex] = useState(0);

  const [selected, setSelected] = useState<{ x: number }>();

  const x = scale
    .scaleTime()
    .range([50, 400])
    .domain([timestamps.start, timestamps.end]);

  const y = scale.scaleLinear().range([270, 20]).domain([0, 150]);

  const horTicks = y.ticks(8);
  const vertTicks = x.ticks(8);

  const data: any[] = [{ x: timestamps.start, y: 0, iconIndex: undefined }];

  timestamps.array.forEach((item, index) => {
    const iconIndex = timestamps.iconIndexes[index];

    data.push({
      x: item,
      y: 30 * iconIndex + 50,
      iconIndex,
    });
  });

  data.push({ x: timestamps.end, y: data.at(-1).y });

  data[0].y = data[1]?.y;

  const line = shape
    .line()
    .x((d: any) => x(d.x))
    .y((d: any) => y(d.y))
    .defined((item: any) => typeof item.y === "number")
    .curve(curves[curveIndex])(data as any);

  const handlePress = () => {
    setTimestamps(randomTimestamps());
  };

  const handleChangeCurve = () => {
    setCurveIndex(curveIndex + 1 >= curves.length ? 0 : curveIndex + 1);
  };

  const onScorePointClicked = (item: any) => {
    setSelected(item.x === selected?.x ? null : item);
  };

  return (
    <SafeAreaView className="h-full bg-primary items-center justify-center">
      <View className="flex-row gap-2">
        <Button onPress={handlePress} containerStyles="m-6">
          Random data
        </Button>
        <Button onPress={handleChangeCurve} containerStyles="m-6">
          Switch curve
        </Button>
      </View>
      {selected && (
        <View>
          <Text className="text-gray-200">
            Selected: {DateTime.fromJSDate((selected as any).x).toFormat("t")}
          </Text>
        </View>
      )}
      <Svg
        style={{
          height: 300,
          width: 400,
          borderRightWidth: 0,
          borderColor: colors.secondary[200],
        }}
      >
        {horTicks.map((tick, index) => {
          const d = `M0 ${y(tick)} L500 ${y(tick)}`;

          return (
            <G key={index}>
              <Path d={d} stroke={colors.gray[100]} opacity={0.2} />
            </G>
          );
        })}
        {vertTicks.map((tick, index) => {
          const d = `M${x(tick)} 300 L${x(tick)} 0`;
          const time = DateTime.fromJSDate(tick).toFormat("HH:mm");

          return (
            <G key={index}>
              <Path d={d} stroke={colors.gray[100]} opacity={0.2} />
              <SvgText
                textAnchor="middle"
                x={x(tick)}
                y={290}
                stroke={colors.secondary[200]}
              >
                {time}
              </SvgText>
            </G>
          );
        })}
        <AnimatedPath
          animate={true}
          animationDuration={500}
          d={line || ""}
          fill="none"
          stroke={colors.secondary[200]}
        />
        {data
          .filter((item) => typeof item.iconIndex !== "undefined")
          .map((item, index) => {
            return (
              <ScorePoint
                onPress={onScorePointClicked}
                x={x(item.x)}
                y={y(item.y)}
                key={index}
                item={item}
                selected={selected?.x === item.x}
              />
            );
          })}
      </Svg>
    </SafeAreaView>
  );
};

export default Score;
