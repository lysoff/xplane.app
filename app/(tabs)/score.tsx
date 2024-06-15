import React, { useState } from "react";
import * as shape from "d3-shape";
import AreaChart from "@/components/charts/AreaChart";
import { Grid } from "@/components/charts/Grid";
import { SafeAreaView, View } from "react-native";
import { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import Button from "@/components/Button";
import AnimatedPath from "@/components/charts/AnimatedPath";

const AreaChartExample = () => {
  const [data, setData] = useState([
    50, 10, 40, 95, -4, -24, 85, 201, 35, 53, -53, 24, 50, -20, -80,
  ]);

  const Gradient = ({ index }: any) => (
    <Defs key={index}>
      <LinearGradient id={"gradient"} x1={"0%"} y1={"0%"} x2={"0%"} y2={"100%"}>
        <Stop offset={"0%"} stopColor={"rgb(255, 156, 1)"} stopOpacity={0.8} />
        <Stop
          offset={"100%"}
          stopColor={"rgb(255, 156, 1)"}
          stopOpacity={0.2}
        />
      </LinearGradient>
    </Defs>
  );

  const Line = ({ d = "" }: { d?: string }) => {
    console.log({ d });
    return (
      <AnimatedPath
        animate={true}
        animationDuration={3000}
        key={"line"}
        d={d}
        stroke={"rgb(255, 156, 1)"}
        fill={"none"}
      />
    );
  };

  const randomize = (array: Array<any>) => {
    const resultArray = [];

    for (const value of array) {
      if (Math.random() * 10 > 5) {
        resultArray.push(value);
      } else {
        resultArray.unshift(value);
      }
    }

    return resultArray;
  };
  const handleClick = () => {
    setData(randomize(data));
  };

  return (
    <SafeAreaView className="h-full bg-primary items-center">
      <Button onPress={handleClick}>Switch</Button>
      <View className="h-full flex-col items-center justify-center">
        {/* <AreaChart
          style={{ height: 200 }}
          data={data}
          contentInset={{ top: 30, bottom: 30 }}
          curve={shape.curveNatural}
          svg={{ fill: "rgba(255, 156, 1, 0.8)" }}
        >
          <Grid />
        </AreaChart> */}
        {/* <AreaChart
          curve={shape.curveNatural}
          style={{ height: 200 }}
          data={data}
          contentInset={{ top: 20, bottom: 20 }}
          svg={{ fill: "url(#gradient)" }}
        >
          <Grid />
          <Gradient />
        </AreaChart> */}
        <AreaChart
          style={{ height: 300 }}
          data={data}
          contentInset={{ top: 10, bottom: 10 }}
          curve={shape.curveNatural}
          svg={{ fill: "rgba(255, 156, 1, 0.2)" }}
        >
          <Grid />
          <Line />
        </AreaChart>
      </View>
    </SafeAreaView>
  );
};

export default AreaChartExample;
