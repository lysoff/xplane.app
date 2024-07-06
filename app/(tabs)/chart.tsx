import { StyleSheet, SafeAreaView, useWindowDimensions } from "react-native";
import React, { useEffect, useMemo } from "react";
import * as d3 from "d3";
import {
  Canvas,
  Group,
  Offset,
  RoundedRect,
  Skia,
  Text,
  useFont,
} from "@shopify/react-native-skia";
import BarPath from "@/components/charts/BarPath";
import XAxisText from "@/components/charts/XAxisText";
import {
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import ValueText from "@/components/charts/ValueText";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { colors } from "@/constants/colors";
import * as Haptics from "expo-haptics";

const data = [
  { label: "Mon", day: "Monday", value: 100 },
  { label: "Tue", day: "Tuesday", value: 65 },
  { label: "Wed", day: "Wednesday", value: 76 },
  { label: "Thu", day: "Thursday", value: 106 },
  { label: "Fri", day: "Friday", value: 34 },
  { label: "Sat", day: "Saturday", value: 23 },
  { label: "Sun", day: "Sunday", value: 37 },
];

const DAY_SIZE = 44;
const DAY_GAP = 10;

const Chart = () => {
  const { width } = useWindowDimensions();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(300, withTiming(1, { duration: 500 }));
  }, []);

  const canvasWidth = width;
  const canvasHeight = 350;

  const graphWidth = width;
  const graphMargin = 20;
  const graphHeight = canvasHeight - graphMargin;

  const barWidth = 28;

  const xRange = [0, graphWidth];
  const xDomain = data.map(({ label }) => label);

  const x = d3.scalePoint().range(xRange).domain(xDomain).padding(1);

  const yRange = [0, graphHeight - 30];
  const yDomain = [0, d3.max(data, (item) => item.value)!];

  const y = d3.scaleLinear().range(yRange).domain(yDomain);

  const translateX = useMemo(() => {
    return (width - ((DAY_SIZE + DAY_GAP) * 7 - DAY_GAP)) / 2;
  }, [width]);

  const offsetY = useSharedValue(0);
  const currentOffset = useSharedValue(0);
  const currentIndex = useSharedValue(0);

  function vibrate() {
    Haptics.selectionAsync();
  }

  function impact() {
    setTimeout(() => Haptics.impactAsync(), 300);
  }

  const gesture = Gesture.Pan()
    .onChange((e) => {
      const newValue = Math.min(0, currentOffset.value + e.translationY);
      offsetY.value = newValue;

      const newIndex = Math.trunc(newValue / (DAY_SIZE + DAY_GAP));
      if (currentIndex.value !== newIndex) {
        currentIndex.value = newIndex;
        runOnJS(vibrate)();
      }
    })
    .onEnd((e) => {
      const mod = (currentOffset.value + e.translationY) % (DAY_SIZE + DAY_GAP);

      console.log({ mod, half: -((DAY_SIZE + DAY_GAP) / 2) });
      const newValue =
        currentOffset.value +
        e.translationY -
        mod +
        (mod < -((DAY_SIZE + DAY_GAP) / 2) ? -(DAY_SIZE + DAY_GAP) : 0);

      offsetY.value = withSpring(Math.min(0, newValue));
      currentOffset.value = Math.min(0, newValue);

      runOnJS(impact)();
    });

  const transform = useDerivedValue(() => {
    return [{ translateY: offsetY.value }, { translateX: translateX }];
  });

  return (
    <SafeAreaView style={styles.container} className="bg-primary">
      <Canvas
        style={{
          width: canvasWidth,
          height: canvasHeight,
        }}
      >
        {data.map((dataPoint) => (
          <Group key={dataPoint.label}>
            <ValueText
              x={x(dataPoint.label)!}
              y={y(dataPoint.value)}
              progress={progress}
            />
            <BarPath
              x={x(dataPoint.label)!}
              y={y(dataPoint.value)}
              graphHeight={graphHeight}
              barWidth={barWidth}
              progress={progress}
            />
            <XAxisText
              x={x(dataPoint.label)!}
              y={canvasHeight}
              text={dataPoint.label}
            />
          </Group>
        ))}
      </Canvas>
      <GestureDetector gesture={gesture}>
        <Canvas style={{ marginTop: 10, flex: 1 }}>
          <Group transform={transform}>
            {new Array(200).fill(0).map((_, i) => (
              <Day index={i} key={i} />
            ))}
          </Group>
        </Canvas>
      </GestureDetector>
    </SafeAreaView>
  );
};

const Day = ({ index }: { index: number }) => {
  const x = (index % 7) * (DAY_SIZE + DAY_GAP);
  const y = Math.trunc(index / 7) * (DAY_SIZE + DAY_GAP);

  const font = useFont(require("@/assets/fonts/Poppins-SemiBold.ttf"));

  if (!font) {
    return null;
  }

  const textX = x - font?.measureText(String(index)).width! / 2;

  return (
    <Group>
      <RoundedRect
        x={x}
        y={y}
        width={DAY_SIZE}
        height={DAY_SIZE}
        r={8}
        color="lightblue"
      />
      <Text
        color={colors.primary}
        font={font}
        x={textX + 22}
        y={y + 27}
        text={String(index)}
      />
    </Group>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chart;
