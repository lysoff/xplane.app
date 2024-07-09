import { StyleSheet, SafeAreaView, useWindowDimensions } from "react-native";
import React, { useEffect } from "react";

import { useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import HeatMap from "@/components/charts/HeatMap";
import WeekChart from "@/components/charts/WeekChart";
import { CurrentIndexProvider } from "@/components/charts/useCurrentIndexContext";

const Chart = () => {
  const { width } = useWindowDimensions();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(300, withTiming(1, { duration: 500 }));
  }, []);

  return (
    <CurrentIndexProvider>
      <SafeAreaView style={styles.container} className="bg-primary">
        <WeekChart width={width} height={300} />
        <HeatMap />
      </SafeAreaView>
    </CurrentIndexProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chart;
