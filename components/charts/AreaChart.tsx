import * as array from "d3-array";
import * as scale from "d3-scale";
import * as shape from "d3-shape";
import React, { ReactNode, useState } from "react";
import { View } from "react-native";
import Svg from "react-native-svg";
import Path from "./AnimatedPath";

interface AreaChartProps {
  start?: number;
  data: Array<any>;
  // data: number | Array<any> | Record<string, any>;
  svg: Record<string, any>;
  style: any;
  animate?: boolean;
  animationDuration?: number;
  curve: any;
  contentInset?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  numberOfTicks?: number;
  gridMin?: number;
  gridMax?: number;
  yMin?: any;
  yMax?: any;
  xMin?: any;
  xMax?: any;
  clampX?: boolean;
  clampY?: boolean;
  xScale?: Function;
  yScale?: Function;
  xAccessor?: Function;
  yAccessor?: Function;

  children: ReactNode;
}

const AreaChart = (props: AreaChartProps) => {
  const {
    curve = shape.curveLinear,
    start = 0,
    data,
    xAccessor = ({ index }: any) => index,
    yAccessor = ({ item }: any) => item,
    xScale = scale.scaleLinear,
    yScale = scale.scaleLinear,
    style,
    animate = true,
    animationDuration = 100,
    numberOfTicks = 10,
    contentInset: { top = 0, bottom = 0, left = 0, right = 0 } = {},
    gridMax,
    gridMin,
    clampX,
    clampY,
    svg = {},
    children,
  } = props;

  const [dimensions, setDimensions] = useState({ height: 200, width: 300 });
  const { width, height } = dimensions;

  const _onLayout = (event: any) => {
    const {
      nativeEvent: {
        layout: { height, width },
      },
    } = event;

    setDimensions({ height, width });
  };

  const createPaths = ({ data, x, y }: any) => {
    const area = shape
      .area()
      .x((d: any) => x(d.x))
      .y0(y(start))
      .y1((d: any) => y(d.y))
      .defined((item: any) => typeof item.y === "number")
      .curve(curve)(data);

    const line = shape
      .line()
      .x((d: any) => x(d.x))
      .y((d: any) => y(d.y))
      .defined((item: any) => typeof item.y === "number")
      .curve(curve)(data);

    return {
      path: area,
      area,
      line,
    };
  };

  if (Array.isArray(data) && data.length === 0) {
    return <View style={style} />;
  }

  const mappedData = data.map((item, index) => ({
    y: yAccessor({ item, index }),
    x: xAccessor({ item, index }),
  }));

  const yValues = mappedData.map((item) => item.y);
  const xValues = mappedData.map((item) => item.x);

  const yExtent = array.extent([...yValues, gridMin, gridMax]);
  const xExtent = array.extent([...xValues]);

  const {
    yMin = yExtent[0],
    yMax = yExtent[1],
    xMin = xExtent[0],
    xMax = xExtent[1],
  } = props;

  //invert range to support svg coordinate system

  const y = yScale()
    .domain([yMin, yMax])
    .range([height - bottom, top])
    .clamp(clampY);

  const x = xScale()
    .domain([xMin, xMax])
    .range([left, width - right])
    .clamp(clampX);

  const paths = createPaths({
    data: mappedData,
    x,
    y,
  });

  const ticks = y.ticks(numberOfTicks);

  const extraProps = {
    x,
    y,
    data,
    ticks,
    width,
    height,
    ...paths,
  };

  return (
    <View style={style}>
      <View style={{ flex: 1 }} onLayout={(event) => _onLayout(event)}>
        {height > 0 && width > 0 && (
          <Svg style={{ height, width }}>
            {React.Children.map(children, (child) => {
              if (
                child &&
                React.isValidElement(child) &&
                child.props.belowChart
              ) {
                return React.cloneElement(child, extraProps);
              }
              return null;
            })}
            <Path
              fill={"none"}
              {...svg}
              d={paths.path || ""}
              animate={animate}
              animationDuration={animationDuration}
            />
            {React.Children.map(children, (child) => {
              if (
                child &&
                React.isValidElement(child) &&
                !child.props.belowChart
              ) {
                return React.cloneElement(child, extraProps);
              }
              return null;
            })}
          </Svg>
        )}
      </View>
    </View>
  );
};

export default AreaChart;
