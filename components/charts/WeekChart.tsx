import React, { useEffect, useMemo } from "react";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { colors } from "@/constants/colors";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import * as d3 from "d3";
import { useCurrentIndexContext } from "./useCurrentIndexContext";
import { useDays } from "@/utils/useDays";

const BAR_WIDTH = 40;

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
  const progress = useSharedValue(0);
  const { currentIndex, currentIndexJS } = useCurrentIndexContext();

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

  const yRange = [0, canvasHeight - 30];
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
    };
  };

  const weekBars = Array.from({ length: 7 }).map((_, i) => {
    const { x, y, width, height } = getBarData(i);

    return {
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
    }
  }, [week]);

  useEffect(() => {
    progress.value = withDelay(300, withTiming(1, { duration: 500 }));
  }, []);

  return (
    <Canvas
      style={{
        width: canvasWidth,
        height: canvasHeight,
      }}
    >
      {weekBars.map(({ x, y, width, height }, index) => {
        return <BarPath key={index} {...{ x, y, width, height }} />;
      })}
    </Canvas>
  );
};

const BarPath = ({
  x,
  y,
  width,
  height,
}: {
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
        y,
        width,
        height: height.value,
      },
      rx: 8,
      ry: 8,
    });

    return barPath;
  });

  return <Path path={path} color={colors.secondary[200]} />;
};

export default WeekChart;
