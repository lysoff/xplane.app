import { FlatList, SafeAreaView, Text, View } from "react-native";
import React, { useState } from "react";
import Button from "@/components/Button";
import ScoreGraph, { curves } from "@/components/charts/ScoreGraph";
import ScoreDetails from "@/components/charts/ScoreDetails";
import { randomTimestamps } from "@/utils/randomTimestamps";
import { FieldType, Icons } from "@/components/charts/ScorePoint";
import ScoreButtonFilter from "@/components/ScoreButtonFilter";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

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

const initialFields: FieldType[] = ["grid", "hammer", "globe"];

const Score = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [curveIndex, setCurveIndex] = useState(0);
  const [fields, setFields] = useState<FieldType[]>(initialFields);

  const [days, setDays] = useState<[Date, FieldType | undefined][][]>(
    getRandomWeek()
  );

  const handlePress = () => {
    setDays(getRandomWeek());
  };

  const handleChangeCurve = () => {
    setCurveIndex(curveIndex + 1 >= curves.length ? 0 : curveIndex + 1);
  };

  const handleFilterPress = (field: FieldType) => {
    if (fields.includes(field)) {
      setFields(fields.filter((_field) => _field !== field));
    } else {
      setFields([...fields, field]);
    }
  };

  return (
    <SafeAreaView className="h-full w-full bg-primary items-center justify-center">
      <View className="h-full w-full p-6 bg-primary items-center">
        <View className="flex-row mb-10">
          <Button onPress={handlePress} containerStyles="m-1 p-3">
            Random data
          </Button>
          <Button onPress={handleChangeCurve} containerStyles="m-1 p-3">
            Switch curve
          </Button>
        </View>
        <View className="flex-row justify-center items-center gap-2">
          {(Object.keys(Icons) as FieldType[]).map((field) => (
            <ScoreButtonFilter
              key={field}
              field={field}
              onPress={handleFilterPress}
              selected={fields.includes(field)}
            />
          ))}
        </View>
        <View className="h-[330px]">
          <FlatList
            horizontal={true}
            data={days}
            renderItem={({ item, index }) => (
              <ScoreGraph
                title={<ScoreDetails pageNumber={index} />}
                fields={fields}
                data={item}
                curveIndex={curveIndex}
              />
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
        <View className="w-full">
          {initialFields.map((field) => (
            <View key={field} className="flex-row">
              <View className="w-[130px] text-ellipsis">
                <Text className="text-gray-200 text-xl">{field}</Text>
              </View>
              <View className="flex-row">
                {days[currentPage]
                  .filter(([, _field]) => field === _field)
                  .map((_, index) => (
                    <MaterialCommunityIcons
                      name="plus"
                      color={colors.gray[100]}
                      size={24}
                      key={index}
                    />
                  ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Score;
