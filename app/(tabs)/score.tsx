import { FlatList, SafeAreaView, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import ScoreGraph, { curves } from "@/components/charts/ScoreGraph";
import ScoreDetails from "@/components/charts/ScoreDetails";
import { randomTimestamps } from "@/utils/randomTimestamps";
import { FieldType, Icons } from "@/components/charts/ScorePoint";
import ScoreButtonFilter from "@/components/ScoreButtonFilter";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { useListScore } from "@/services/scoreService";
import { Field, useFields } from "@/services/fieldService";
import { DateTime } from "luxon";

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

const mapFieldIcons = (fields: Field[]) => {
  return fields.map(({ icon }) => icon);
};

const Score = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [curveIndex, setCurveIndex] = useState(0);

  const { data: initialFields = [] } = useFields(true);

  const [fields, setFields] = useState(initialFields);
  useEffect(() => {
    if (fields !== initialFields) {
      setFields(initialFields);
    }
  }, [initialFields]);

  const { data: scores } = useListScore();

  const days = useMemo(() => {
    const result: [Date, FieldType?][][] = [];
    if (!scores) return result;

    let minDate = new Date().toISOString();
    const scoreDays: Record<string, [Date, FieldType?][]> = {};

    for (const score of scores) {
      const scoreDate = new Date(score.$createdAt);
      const scoreDay = DateTime.fromJSDate(scoreDate).startOf("day").toISO();

      const scoreField = (score.fields as Field).icon;
      if (!scoreDay) continue;

      if (scoreDay < minDate) {
        minDate = scoreDay;
      }

      if (!scoreDays[scoreDay]) {
        scoreDays[scoreDay] = [];
      }

      scoreDays[scoreDay].push([scoreDate, scoreField]);
    }

    while (new Date(minDate) <= new Date()) {
      const _data: [Date, FieldType?][] = scoreDays[minDate] || [];
      _data.unshift([new Date(minDate), undefined]);
      _data.push([
        DateTime.fromISO(minDate).endOf("day").toJSDate(),
        undefined,
      ]);

      result.push(_data);

      minDate = DateTime.fromISO(minDate).plus({ days: 1 }).toISO() || Date();
    }

    return result;
  }, [scores]);

  const [daysX, setDays] = useState<[Date, FieldType | undefined][][]>(
    getRandomWeek()
  );

  const handlePress = () => {
    setDays(getRandomWeek());
  };

  const handleChangeCurve = () => {
    setCurveIndex(curveIndex + 1 >= curves.length ? 0 : curveIndex + 1);
  };

  const handleFilterPress = (field: FieldType) => {
    if (mapFieldIcons(fields).includes(field)) {
      setFields(fields.filter(({ icon }) => icon !== field));
    } else {
      setFields(
        initialFields.filter(
          ({ icon }) => mapFieldIcons(fields).includes(icon) || icon === field
        )
      );
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
          {initialFields.map(({ icon }) => (
            <ScoreButtonFilter
              key={icon}
              field={icon}
              onPress={handleFilterPress}
              selected={mapFieldIcons(fields).includes(icon)}
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
                fields={mapFieldIcons(fields)}
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
            <View key={field.icon} className="flex-row">
              <View className="w-[130px] text-ellipsis">
                <Text className="text-gray-200 text-xl">{field.name}</Text>
              </View>
              <View className="flex-row flex-1 flex-wrap">
                {days[currentPage] &&
                  days[currentPage]
                    .filter(([, _field]) => field.icon === _field)
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
