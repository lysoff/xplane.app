import { SafeAreaView, Text, View } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { randomTimestamps } from "@/utils/randomTimestamps";
import * as shape from "d3-shape";
import * as scale from "d3-scale";
import { G, Path, Svg, Text as SvgText } from "react-native-svg";
import { colors } from "@/constants/colors";
import { DateTime } from "luxon";
import Button from "@/components/Button";
import ScorePoint from "@/components/ScorePoint";
import AnimatedPath from "@/components/charts/AnimatedPath";
import ViewShot from "react-native-view-shot";

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

  const ref = useRef(null);

  const x = scale
    .scaleTime()
    .range([30, 370])
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

  const handleSave = () => {
    (ref.current as any).capture().then(
      async (uri: any) => {
        await MediaLibrary.saveToLibraryAsync(uri);
        console.log("saved", uri);
      },
      (error: any) => console.error("Oops, snapshot failed", error)
    );
  };

  return (
    <SafeAreaView className="h-full w-full bg-primary items-center justify-center">
      <View className="h-full bg-primary items-center flex-col">
        <View className="flex-row">
          <Button onPress={handlePress} containerStyles="m-1 p-3">
            Random data
          </Button>
          <Button onPress={handleChangeCurve} containerStyles="m-1 p-3">
            Switch curve
          </Button>
          <Button onPress={handleSave} containerStyles="m-1 p-3">
            Save
          </Button>
        </View>

        <View className="flex-1 w-full">
          <ViewShot
            ref={ref}
            style={{ backgroundColor: "transparent" }}
            options={{ fileName: "Your-File-Name", format: "png", quality: 1 }}
          >
            <Svg
              fill={colors.primary}
              fillOpacity={0.2}
              style={{
                height: 300,
                width: 400,
                borderRightWidth: 0,
                backgroundColor: "transparent",
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
                  </G>
                );
              })}
              {vertTicks.length > 0 && (
                <G>
                  <Path
                    d={`M${x(timestamps.end)} 300 L${x(timestamps.end)} 0`}
                    stroke={colors.gray[100]}
                    opacity={0.2}
                  />
                </G>
              )}
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
          </ViewShot>
          {selected && (
            <View>
              <Text className="text-gray-200">
                Selected:{" "}
                {DateTime.fromJSDate((selected as any).x).toFormat("t")}
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Score;
