import { View, StyleSheet } from "react-native";
import React from "react";
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

const array = (function () {
  const _array = [];
  for (let i = 0; i < 200; i++) {
    _array.push(i);
  }

  return _array;
})();

const Main = () => {
  const hovered = useSharedValue(-1);
  const first = useSharedValue(-1);
  const last = useSharedValue(-1);

  function vibrate() {
    Haptics.selectionAsync();
  }

  const longPress = Gesture.LongPress().onStart((e) => {
    runOnJS(vibrate)();

    const index = Math.round(e.x / 25) * 7 + Math.round(e.y / 25);

    if (index !== last.value) {
      first.value = index;
    }
    last.value = -1;
  });

  const gesture = Gesture.Pan()
    .onTouchesDown((e) => {
      hovered.value =
        Math.round(e.allTouches[0].x / 25) * 7 +
        Math.round(e.allTouches[0].y / 25);
    })

    .onTouchesUp((e) => {
      if (first.value !== -1) {
        last.value =
          Math.round(e.allTouches[0].x / 25) * 7 +
          Math.round(e.allTouches[0].y / 25);
      }
      hovered.value = -1;
    })
    .onChange((e) => {
      const index = Math.round(e.x / 25) * 7 + Math.round(e.y / 25);
      if (hovered.value !== index) {
        runOnJS(vibrate)();
        hovered.value = index;
      }
    })
    .onEnd((e) => {
      hovered.value = -1;
    });

  return (
    <SafeAreaView className="h-full bg-primary items-center">
      <View className="h-full justify-center item-center">
        <View className="h-[300px]">
          <Animated.ScrollView horizontal={true}>
            <GestureDetector gesture={Gesture.Simultaneous(longPress, gesture)}>
              <View className="relative flex-col h-[170px] flex-wrap">
                {array.map((_, i) => (
                  <Day
                    first={first}
                    last={last}
                    hovered={hovered}
                    index={i}
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
  first,
  last,
  hovered,
  index,
}: {
  first: SharedValue<number>;
  last: SharedValue<number>;
  hovered: SharedValue<number>;
  selected?: SharedValue<number>;
  index: number;
}) => {
  const zIndexStyle = useAnimatedStyle(() => ({
    zIndex: hovered.value == index ? 100 : 0,
    borderWidth: first.value === index || last.value === index ? 4 : 1,
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
    width: withTiming(hovered.value === index ? 40 : 0, { duration: 50 }),
    height: withTiming(hovered.value === index ? 40 : 0, { duration: 50 }),
    opacity: withTiming(hovered.value === index ? 1 : 0, { duration: 50 }),
    backgroundColor:
      first.value === index || last.value === index ? "#cde" : colors.primary,
  }));

  const textStyle = useAnimatedStyle(() => ({
    color:
      first.value === index || last.value === index
        ? colors.primary
        : colors.gray[100],
  }));

  return (
    <Animated.View
      className="relative border m-[2px] border-red-400 rounded-md justify-center items-center"
      style={[styles.day, zIndexStyle]}
    >
      <Animated.Text style={textStyle}>{index}</Animated.Text>
      <Animated.View
        style={[animatedStyle]}
        className="border -l-[10px] -top-[50px] bg-primary border-red-400  rounded-md justify-center items-center"
      >
        <Animated.Text style={textStyle}>{index}</Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  day: {
    width: 20,
    height: 20,
    backgroundColor: colors.primary,
    borderWidth: 1,
    color: colors.gray[100],
  },
  overlay: {
    width: 0,
    height: 0,
    opacity: 0,
  },
});

export default Main;
