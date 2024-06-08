import { View, Text } from "react-native";
import React, { useState } from "react";
import { Field } from "@/services/fieldService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface FieldCardProps {
  field: Field;
}

const X_THRESHOLD = -104;

const FieldCard = ({ field }: FieldCardProps) => {
  const translationX = useSharedValue(0);
  const currentTranslateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onChange((e) => {
      translationX.value = Math.max(
        X_THRESHOLD,
        currentTranslateX.value + e.translationX
      );
    })
    .onEnd((e) => {
      if (e.translationX < X_THRESHOLD) {
        translationX.value = X_THRESHOLD;
      } else {
        translationX.value = 0;
      }

      currentTranslateX.value = translationX.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(translationX.value),
      },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View>
        <Animated.View className="absolute right-0 bg-red-400 px-10 py-3">
          <MaterialCommunityIcons name="trash-can" color="white" size={24} />
        </Animated.View>
        <Animated.View
          className="w-full flex-row items-center border-b-0 p-2 border-secondary bg-primary"
          style={[
            {
              borderTopWidth: 2,
            },
            animatedStyle,
          ]}
        >
          <MaterialCommunityIcons
            name={field.icon as any}
            size={30}
            color="#FF9C01"
          />
          <Text className="text-secondary text-xl">{field.name}</Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default FieldCard;
