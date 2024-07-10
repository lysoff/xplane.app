import React, { useEffect, useMemo } from "react";
import {
  Canvas,
  Group,
  Path,
  Skia,
  Text,
  useFont,
} from "@shopify/react-native-skia";
import { colors } from "@/constants/colors";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as d3 from "d3";
import { useCurrentIndexContext } from "./useCurrentIndexContext";
import { labels, useDays } from "@/utils/useDays";

const BAR_WIDTH = 30;

export type DataPoint = {
  day: string;
  label: string;
  value: number;
};

const WeekChart = ({
  width: canvasWidth,
  height: canvasHeight,
}: {
  width: number;
  height: number;
}) => {
  const { currentIndexJS } = useCurrentIndexContext();

  const days = useDays();

  const week = useMemo(() => {
    const _week: DataPoint[] = [];

    for (let i = 0; i < 7; i++) {
      _week.push(days[currentIndexJS * -1 * 7 + i]);
    }

    return _week;
  }, [currentIndexJS]);

  const xRange = [0, canvasWidth];
  const xDomain = week.map(({ label }) => label);

  const xScale = d3.scalePoint().range(xRange).domain(xDomain).padding(1);

  const yRange = [0, canvasHeight - 50];
  const yDomain = [0, d3.max(week, ({ value }) => value)!];

  const yScale = d3.scaleLinear().range(yRange).domain(yDomain);

  const getBarData = (index: number) => {
    const dataPoint = week[index];
    const x = xScale(dataPoint.label)! - BAR_WIDTH / 2;

    const y = canvasHeight;
    const width = BAR_WIDTH;
    const height = yScale(dataPoint.value)! * -1;

    return {
      x,
      y,
      width,
      height,
      value: dataPoint.value,
    };
  };

  const weekBars = Array.from({ length: 7 }).map((_, i) => {
    const { x, y, width, height, value } = getBarData(i);

    return {
      day: labels[i],
      value: useSharedValue(value),
      x: useSharedValue(x),
      y,
      width,
      height: useSharedValue(height),
    };
  });

  useEffect(() => {
    for (let i = 0; i < 7; i++) {
      const day = weekBars[i]!;

      const barData = getBarData(i);

      day.x.value = withTiming(barData.x);
      day.height.value = withTiming(barData.height);
      day.value.value = withTiming(barData.value);
    }
  }, [week]);

  return (
    <Canvas
      style={{
        width: canvasWidth,
        height: canvasHeight,
      }}
    >
      {weekBars.map(({ x, y, width, height, value, day }, index) => {
        return <Bar key={index} {...{ x, y, width, height, value, day }} />;
      })}
    </Canvas>
  );
};

const Bar = ({
  x,
  y,
  width,
  height,
  value,
  day,
}: {
  day: string;
  value: SharedValue<number>;
  x: SharedValue<number>;
  y: number;
  width: number;
  height: SharedValue<number>;
}) => {
  const path = useDerivedValue(() => {
    const barPath = Skia.Path.Make();
    barPath.addRRect({
      rect: {
        x: x.value,
        y: y - 20,
        width,
        height: height.value,
      },
      rx: 8,
      ry: 8,
    });

    return barPath;
  });

  const font = useFont(require("@/assets/fonts/Poppins-SemiBold.ttf"));

  const textX = useDerivedValue(() => {
    const textWidth = font?.measureText(day).width || 0;

    return x.value - (textWidth - BAR_WIDTH) / 2;
  });

  if (!font) {
    return null;
  }

  return (
    <Group>
      <Path path={path} color={colors.secondary[200]} />
      <Text color={colors.gray[100]} font={font} x={textX} y={y} text={day} />
    </Group>
  );
};

export default WeekChart;
