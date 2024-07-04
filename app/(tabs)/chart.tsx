import { StyleSheet, SafeAreaView, useWindowDimensions } from "react-native";
import React, { useEffect } from "react";
import * as d3 from "d3";
import { Canvas, Group } from "@shopify/react-native-skia";
import BarPath from "@/components/charts/BarPath";
import XAxisText from "@/components/charts/XAxisText";
import { useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import ValueText from "@/components/charts/ValueText";

const data = [
  { label: "Mon", day: "Monday", value: 100 },
  { label: "Tue", day: "Tuesday", value: 65 },
  { label: "Wed", day: "Wednesday", value: 76 },
  { label: "Thu", day: "Thursday", value: 106 },
  { label: "Fri", day: "Friday", value: 34 },
  { label: "Sat", day: "Saturday", value: 23 },
  { label: "Sun", day: "Sunday", value: 37 },
];

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chart;
