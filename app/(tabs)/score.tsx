import { FlatList, SafeAreaView, View } from "react-native";
import React, { useState } from "react";
import * as shape from "d3-shape";
import Button from "@/components/Button";
import ScoreGraph from "@/components/charts/ScoreGraph";

const days = [0, 1, 2, 3, 4, 5];

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
  const [curveIndex, setCurveIndex] = useState(0);
  const [randomizer, setRandomizer] = useState(0);

  const handlePress = () => {
    setRandomizer(Math.random());
  };

  const handleChangeCurve = () => {
    setCurveIndex(curveIndex + 1 >= curves.length ? 0 : curveIndex + 1);
  };

  return (
    <SafeAreaView className="h-full w-full bg-primary items-center justify-center">
      <View className="h-full w-full p-6 bg-primary items-center flex-col">
        <View className="flex-row mb-20">
          <Button onPress={handlePress} containerStyles="m-1 p-3">
            Random data
          </Button>
          <Button onPress={handleChangeCurve} containerStyles="m-1 p-3">
            Switch curve
          </Button>
        </View>

        <FlatList
          key={randomizer}
          horizontal={true}
          data={days}
          renderItem={() => <ScoreGraph curveIndex={curveIndex} />}
          pagingEnabled
        />
      </View>
    </SafeAreaView>
  );
};

export default Score;
