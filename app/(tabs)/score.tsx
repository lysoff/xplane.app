import React from "react";
import * as shape from "d3-shape";
import AreaChart from "@/components/charts/AreaChart";
import { Grid } from "@/components/charts/Grid";
import { SafeAreaView } from "react-native";

class AreaChartExample extends React.PureComponent {
  render() {
    const data = [
      50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80,
    ];

    return (
      <SafeAreaView className="h-full bg-primary items-center">
        <AreaChart
          style={{ height: 200 }}
          data={data}
          contentInset={{ top: 30, bottom: 30 }}
          curve={shape.curveNatural}
          svg={{ fill: "rgba(134, 65, 244, 0.8)" }}
        >
          <Grid />
        </AreaChart>
      </SafeAreaView>
    );
  }
}

export default AreaChartExample;
