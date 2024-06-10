import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Field, updateField } from "@/services/fieldService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Gesture, GestureDetector, Switch } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { colors } from "@/constants/colors";
import { router } from "expo-router";

interface FieldCardProps {
  field: Field;
  onDelete: (id: string) => Promise<void>;
}

const X_THRESHOLD = -80;
const LINE_HEIGHT = 70;

const FieldCard = ({ field: _field, onDelete }: FieldCardProps) => {
  const translationX = useSharedValue(0);
  const currentTranslateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const height = useSharedValue(LINE_HEIGHT);

  const [field, setField] = useState({ ..._field });

  const pan = Gesture.Pan()
    .onChange((e) => {
      translationX.value = Math.max(
        X_THRESHOLD,
        currentTranslateX.value + e.translationX
      );
    })
    .onEnd((e) => {
      if (e.translationX < X_THRESHOLD) {
        translationX.value = X_THRESHOLD * 2;
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

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    height: height.value,
  }));

  const handleDelete = () => {
    opacity.value = withTiming(0);
    height.value = withDelay(100, withTiming(0));

    runOnJS(onDelete)(field.$id);
  };

  const handleEdit = () => {
    router.push(`/edit/${field.$id}`);

    translationX.value = 0;
  };

  const handleSwitch = async (value: boolean) => {
    try {
      setField({ ...field, active: value });
      await updateField(field.$id, { active: value });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={containerStyle}>
        <Animated.View className="absolute right-0 flex-row">
          <TouchableOpacity
            onPress={handleEdit}
            className="bg-yellow-400 w-[80px] h-[70px] items-center justify-center"
          >
            <MaterialCommunityIcons name="pencil" color="white" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            className="bg-red-400 w-[80px] h-[70px] items-center justify-center"
          >
            <MaterialCommunityIcons name="trash-can" color="white" size={24} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          className="w-full flex-row items-center border-b-0 p-5 border-secondary bg-primary"
          style={animatedStyle}
        >
          <View className="flex-1">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleEdit}
              className="flex-row items-center"
            >
              <MaterialCommunityIcons
                name={field.icon as any}
                size={30}
                color={
                  field.active ? colors.secondary.DEFAULT : colors.gray[100]
                }
              />
              <Text
                className={`ml-4 text-xl ${
                  field.active ? "text-secondary" : "text-gray-100"
                }`}
              >
                {field.name}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="w-[50px]">
            <Switch
              trackColor={{ true: colors.black[200] }}
              thumbColor={
                field.active ? colors.secondary.DEFAULT : colors.gray[100]
              }
              onValueChange={handleSwitch}
              value={field.active}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default FieldCard;
