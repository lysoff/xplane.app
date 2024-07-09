import { StyleSheet, useWindowDimensions } from "react-native";
import React, { useMemo } from "react";
import {
  Canvas,
  Group,
  RoundedRect,
  Text,
  useFont,
} from "@shopify/react-native-skia";
import {
  SharedValue,
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { colors } from "@/constants/colors";
import * as Haptics from "expo-haptics";
import { useDays } from "@/utils/useDays";
import { useCurrentIndexContext } from "./useCurrentIndexContext";

const DAY_SIZE = 44;
const DAY_GAP = 10;

const HeatMap = () => {
  const { width } = useWindowDimensions();
  const { currentIndex, setCurrentIndexJS } = useCurrentIndexContext();

  const offsetY = useSharedValue(0);
  const currentOffset = useSharedValue(0);
  const previousIndex = useSharedValue(0);

  const translateX = useMemo(() => {
    return (width - ((DAY_SIZE + DAY_GAP) * 7 - DAY_GAP)) / 2;
  }, [width]);

  const data = useDays();

  function vibrate() {
    Haptics.selectionAsync();
  }

  function impact() {
    setTimeout(() => Haptics.impactAsync(), 300);
  }

  const gesture = Gesture.Pan()
    .onChange((e) => {
      const newValue = Math.min(0, currentOffset.value + e.translationY);
      offsetY.value = newValue;

      const newIndex = Math.trunc(newValue / (DAY_SIZE + DAY_GAP));
      if (currentIndex.value !== newIndex) {
        currentIndex.value = newIndex;
        runOnJS(vibrate)();
      }
    })
    .onEnd((e) => {
      const mod = (currentOffset.value + e.translationY) % (DAY_SIZE + DAY_GAP);
      const pulledOverHalf = mod < -((DAY_SIZE + DAY_GAP) / 2);

      const newValue =
        currentOffset.value +
        e.translationY -
        mod +
        (pulledOverHalf ? -(DAY_SIZE + DAY_GAP) : 0);

      if (pulledOverHalf) {
        currentIndex.value -= 1;
      }

      if (previousIndex.value !== currentIndex.value) {
        previousIndex.value = currentIndex.value;

        runOnJS(setCurrentIndexJS)(previousIndex.value);
      }

      offsetY.value = withSpring(Math.min(0, newValue));
      currentOffset.value = Math.min(0, newValue);

      runOnJS(impact)();
    });

  const transform = useDerivedValue(() => {
    return [{ translateY: offsetY.value }, { translateX: translateX }];
  });

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={{ marginTop: 10, flex: 1 }}>
        <Group transform={transform}>
          {data.map((value, i) => {
            return (
              <Day
                currentIndex={currentIndex}
                index={i}
                value={value.value}
                key={i}
              />
            );
          })}
        </Group>
      </Canvas>
    </GestureDetector>
  );
};

const Day = ({
  currentIndex,
  index,
  value,
}: {
  currentIndex: SharedValue<number>;
  index: number;
  value: number;
}) => {
  const x = (index % 7) * (DAY_SIZE + DAY_GAP);
  const y = Math.trunc(index / 7) * (DAY_SIZE + DAY_GAP);

  const font = useFont(require("@/assets/fonts/Poppins-SemiBold.ttf"));

  const color = useDerivedValue(() => {
    return currentIndex.value === -Math.trunc(index / 7)
      ? colors.secondary[200]
      : colors.primary;
  });

  if (!font) {
    return null;
  }

  const textX = x - font?.measureText(String(value)).width! / 2;

  return (
    <Group>
      <RoundedRect
        x={x}
        y={y}
        width={DAY_SIZE}
        height={DAY_SIZE}
        r={8}
        color="lightblue"
      />
      <Text
        color={color}
        font={font}
        x={textX + 22}
        y={y + 27}
        text={String(value)}
      />
    </Group>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HeatMap;
