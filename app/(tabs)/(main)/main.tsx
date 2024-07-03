import { View, StyleSheet, Text } from "react-native";
import React, { Fragment, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import Animated from "react-native-reanimated";
import { colors } from "@/constants/colors";
import { DateTime } from "luxon";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const X_OFFSET = 27;
const Y_OFFSET = 27;
const SIZE = 25;

const getIndex = (x: number, y: number) => {
  "worklet";
  return (
    Math.round((x - X_OFFSET) / SIZE) * 7 +
    Math.min(Math.round((y - Y_OFFSET) / SIZE), 6)
  );
};

const Main = () => {
  const days = useMemo(() => {
    const _days: [DateTime<boolean>, number][] = [];

    const firstDay = DateTime.now().minus({ days: 150 });

    for (let i = 0; i < 300; i++) {
      const nextDay = firstDay.plus({ days: i });
      _days.push([nextDay, nextDay.weekday]);
    }

    return _days;
  }, []);

  const hovered = useSharedValue(-1);
  const first = useSharedValue(-1);
  const last = useSharedValue(-1);

  function vibrate() {
    Haptics.selectionAsync();
  }

  const longPress = Gesture.LongPress().onStart((e) => {
    runOnJS(vibrate)();

    const index = getIndex(e.x, e.y);

    if (index !== last.value) {
      first.value = index;
    }
    last.value = -1;
  });

  const gesture = Gesture.Pan()
    .onTouchesDown((e) => {
      hovered.value = getIndex(e.allTouches[0].x, e.allTouches[0].y);
    })

    .onTouchesUp((e) => {
      if (first.value !== -1) {
        last.value = getIndex(e.allTouches[0].x, e.allTouches[0].y);

        if (last.value < first.value) {
          const temp = last.value;
          last.value = first.value;
          first.value = temp;
        }
      }
      hovered.value = -1;
    })
    .onChange((e) => {
      const index = getIndex(e.x, e.y);
      if (hovered.value !== index) {
        runOnJS(vibrate)();
        hovered.value = index;
      }
    })
    .onEnd((e) => {
      hovered.value = -1;
    });

  const heatmapGesture = Gesture.Simultaneous(longPress, gesture);

  return (
    <SafeAreaView className="h-full bg-primary items-center">
      <View className="h-full justify-center item-center">
        <View className="h-[300px] flex-row">
          <View className="pt-[27px] mr-1">
            {daysOfWeek.map((dayOfWeek) => (
              <View key={dayOfWeek} className="h-[25px] items-end">
                <Text className="text-white">{dayOfWeek}</Text>
              </View>
            ))}
          </View>
          <Animated.ScrollView horizontal={true} className="w-[80vw]">
            <GestureDetector gesture={heatmapGesture}>
              <View className="relative h-[200px] w-[1200px]">
                {days.map(([day], i) => (
                  <Fragment key={i}>
                    {day.day === 1 && (
                      <View
                        className="absolute"
                        style={{
                          left: Math.trunc(i / 7) * 25 + X_OFFSET,
                          top: 5,
                        }}
                      >
                        <Text className="text-white">{day.monthLong}</Text>
                      </View>
                    )}
                  </Fragment>
                ))}
                {days.map((day, i) => (
                  <Day
                    x={Math.trunc(i / 7) * (SIZE + 2)}
                    y={(i % 7) * (SIZE + 2) + 25}
                    first={first}
                    last={last}
                    hovered={hovered}
                    index={i}
                    day={day}
                    key={i}
                  />
                ))}
              </View>
            </GestureDetector>
          </Animated.ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const Day = ({
  x,
  y,
  day: [datetime, weekday],
  first,
  last,
  hovered,
  index,
}: {
  x: number;
  y: number;
  day: [DateTime<boolean>, number];
  first: SharedValue<number>;
  last: SharedValue<number>;
  hovered: SharedValue<number>;
  selected?: SharedValue<number>;
  index: number;
}) => {
  const zIndexStyle = useAnimatedStyle(() => ({
    zIndex: hovered.value == index ? 100 : 0,
    borderWidth: 1,
    backgroundColor:
      first.value === index || last.value === index
        ? "#cde"
        : first.value !== -1 &&
          last.value !== -1 &&
          ((first.value < index && index < last.value) ||
            (last.value < index && index < first.value))
        ? colors.secondary[100]
        : first.value !== -1 &&
          hovered.value !== -1 &&
          ((first.value < index && index < hovered.value) ||
            (hovered.value < index && index < first.value))
        ? colors.gray[100]
        : colors.primary,
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(hovered.value === index ? 50 : 0, { duration: 150 }),
    height: withTiming(hovered.value === index ? 50 : 0, { duration: 150 }),
    opacity: withTiming(hovered.value === index ? 1 : 0, { duration: 150 }),
    backgroundColor:
      first.value === index || last.value === index ? "#cde" : colors.primary,
  }));

  const textStyle = useAnimatedStyle(() => ({
    color:
      first.value === index ||
      last.value === index ||
      (first.value !== -1 &&
        last.value !== -1 &&
        ((first.value < index && index < last.value) ||
          (last.value < index && index < first.value))) ||
      (first.value !== -1 &&
        hovered.value !== -1 &&
        ((first.value < index && index < hovered.value) ||
          (hovered.value < index && index < first.value)))
        ? colors.primary
        : colors.gray[100],
  }));

  return (
    <Animated.View
      className={`absolute m-[2px] rounded-md items-center`}
      style={[
        {
          left: x,
          top: y,
        },
        styles.day,
        zIndexStyle,
      ]}
    >
      <Animated.Text style={textStyle}>{datetime.day}</Animated.Text>
      <Animated.View
        style={[animatedStyle]}
        className="border -l-[10px] -top-[60px] bg-primary border-red-400  rounded-md justify-center items-center"
      >
        <Animated.Text style={textStyle}>{datetime.day}</Animated.Text>
        <Animated.Text style={textStyle}>{datetime.monthShort}</Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  day: {
    width: 22,
    height: 22,
  },
  overlay: {
    width: 0,
    height: 0,
    opacity: 0,
  },
});

export default Main;
