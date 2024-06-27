import {
  View,
  Text,
  SafeAreaView,
  NativeModules,
  NativeEventEmitter,
  Button,
  NativeModule,
} from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Link, Redirect } from "expo-router";
import { useGlobalContext } from "@/context/GlobalContext";
import CustomButton from "@/components/Button";

// useTimer.ts
const { XplaneWidgetModule } = NativeModules;
const XplaneEventEmitter = new NativeEventEmitter(
  NativeModules.XplaneEventEmitter as NativeModule
);

const useTimer = () => {
  const [elapsedTimeInMs, setElapsedTimeInMs] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const startTime = React.useRef<number | null>(null);
  const pausedTime = React.useRef<number | null>(null);

  const intervalId = React.useRef<NodeJS.Timeout | null>(null);

  const elapsedTimeInSeconds = Math.floor(elapsedTimeInMs / 1000);
  const secondUnits = elapsedTimeInSeconds % 10;
  const secondTens = Math.floor(elapsedTimeInSeconds / 10) % 6;
  const minutes = Math.floor(elapsedTimeInSeconds / 60);

  const value = `${minutes}:${secondTens}${secondUnits}`;

  function play() {
    setIsPlaying(true);
    // Already playing, returning early
    if (intervalId.current) {
      return;
    }

    // First time playing, recording the start time
    if (!startTime.current) {
      startTime.current = Date.now();
    }

    if (pausedTime.current) {
      // If the timer is paused, we need to update the start time
      const elapsedSincePaused = Date.now() - pausedTime.current;
      startTime.current = startTime.current! + elapsedSincePaused;
      pausedTime.current = null;
      XplaneWidgetModule.resume();
    } else {
      XplaneWidgetModule.startLiveActivity(startTime.current / 1000);
    }

    intervalId.current = setInterval(() => {
      setElapsedTimeInMs(Date.now() - startTime.current!);
    }, 32);
  }

  function pause() {
    setIsPlaying(false);
    removeInterval();
    if (startTime.current && !pausedTime.current) {
      pausedTime.current = Date.now();
      XplaneWidgetModule.pause(pausedTime.current / 1000);
      setElapsedTimeInMs(pausedTime.current! - startTime.current!);
    }
  }

  function reset() {
    setIsPlaying(false);
    removeInterval();
    startTime.current = null;
    pausedTime.current = null;
    setElapsedTimeInMs(0);
    XplaneWidgetModule.stopLiveActivity();
  }

  function removeInterval() {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }

  useEffect(() => {
    const pauseSubscription = XplaneEventEmitter.addListener("onPause", pause);
    const resumeSubscription = XplaneEventEmitter.addListener("onResume", play);
    const resetSubscription = XplaneEventEmitter.addListener("onReset", reset);
    return () => {
      pauseSubscription.remove();
      resumeSubscription.remove();
      resetSubscription.remove();
    };
  }, [pause, reset, play]);

  return {
    play,
    pause,
    reset,
    value,
    isPlaying,
  };
};

const Welcome = () => {
  const { isLoading, isLogged } = useGlobalContext();
  const { value, reset, play, pause, isPlaying } = useTimer();

  if (!isLoading && isLogged) return <Redirect href="/home" />;

  return (
    <>
      <SafeAreaView className="h-full bg-primary">
        <View className="items-center justify-center bg-primary">
          <Text className="text-xl font-pregular text-secondary">
            Welcome to Xplane
          </Text>
          <Link className="text-gray-500" href="/signin">
            Login or Signup
          </Link>
        </View>
        <View style={{ paddingVertical: 32 }}>
          <Text style={{ fontSize: 80, fontVariant: ["tabular-nums"] }}>
            {value}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 48,
          }}
        >
          <View style={{ marginRight: 32 }}>
            <Button
              title={isPlaying ? "Pause" : "Play"}
              onPress={isPlaying ? pause : play}
            />
          </View>
          <Button title="Stop" onPress={reset} />
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </>
  );
};

export default Welcome;
