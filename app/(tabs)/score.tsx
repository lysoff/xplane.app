import { FlatList, SafeAreaView, View } from "react-native";
import React, { useState } from "react";
import * as shape from "d3-shape";
import Button from "@/components/Button";
import ScoreGraph, { curves } from "@/components/charts/ScoreGraph";
import ScoreDetails from "@/components/charts/ScoreDetails";
import { randomTimestamps } from "@/utils/randomTimestamps";
import { FieldType } from "@/components/ScorePoint";

const getRandomWeek = () => {
  return [
    randomTimestamps(),
    randomTimestamps(),
    randomTimestamps(),
    randomTimestamps(),
    randomTimestamps(),
    randomTimestamps(),
  ];
};

const Score = () => {
  const [curveIndex, setCurveIndex] = useState(0);
  const [fields, setFields] = useState<FieldType[]>([
    "grid",
    "hammer",
    "globe",
  ]);

  const [days, setDays] = useState<[Date, FieldType | undefined][][]>(
    getRandomWeek()
  );
  const [currentPage, setCurrentPage] = useState(0);

  const handlePress = () => {
    setDays(getRandomWeek());
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
        <ScoreDetails pageNumber={currentPage} />
        <FlatList
          horizontal={true}
          data={days}
          renderItem={({ item }) => (
            <ScoreGraph fields={fields} data={item} curveIndex={curveIndex} />
          )}
          pagingEnabled
          onMomentumScrollEnd={(e) => {
            const { contentOffset, layoutMeasurement } = e.nativeEvent;

            let pageNumber = Math.floor(
              contentOffset.x / layoutMeasurement.width
            );

            setCurrentPage(pageNumber);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Score;
