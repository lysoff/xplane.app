import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { Field } from "@/services/fieldService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface FieldCardProps {
  field: Field;
  onDelete: (id: string) => Promise<void>;
}

const X_THRESHOLD = -104;
const LINE_HEIGHT = 70;

const FieldCard = ({ field, onDelete }: FieldCardProps) => {
  const translationX = useSharedValue(0);
  const currentTranslateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const height = useSharedValue(LINE_HEIGHT);

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

  const handlePress = () => {
    opacity.value = withTiming(0);
    height.value = withDelay(100, withTiming(0));

    runOnJS(onDelete)(field.$id);
  };

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    height: height.value,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={containerStyle}>
        <Animated.View
          className="absolute right-0 bg-red-400 px-10"
          style={{ paddingVertical: 23 }}
        >
          <TouchableOpacity onPress={handlePress}>
            <MaterialCommunityIcons name="trash-can" color="white" size={24} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          className="w-full flex-row items-center border-b-0 p-5 border-secondary bg-primary"
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
