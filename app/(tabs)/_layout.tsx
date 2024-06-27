import React from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { Redirect, Tabs } from "expo-router";
import {
  Feather,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@/constants/icons";
import { Text, View } from "react-native";
import { Icon } from "@expo/vector-icons/build/createIconSet";
import LiveActivity from "@/components/LiveActivity";

interface TabIconProps {
  IconComponent: Icon<any, any>;
  color: string;
  name: string;
  title: string;
  focused: boolean;
}

const TabIcon = ({
  IconComponent,
  color,
  name,
  focused,
  title,
}: TabIconProps) => {
  return (
    <View className="flex items-center justify-center gap-2">
      <IconComponent name={name} size={24} color={color} className="w-6 h-6" />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {title}
      </Text>
    </View>
  );
};

const _layout = () => {
  const { isLogged } = useGlobalContext();

  if (!isLogged) return <Redirect href="/signin" />;

  return (
    <>
      <LiveActivity />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                IconComponent={Feather}
                focused={focused}
                color={color}
                name="user"
                title="Home"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(fields)"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                IconComponent={MaterialCommunityIcons}
                focused={focused}
                color={color}
                name="view-list"
                title="Fields"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="score"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                IconComponent={SimpleLineIcons}
                focused={focused}
                color={color}
                name="graph"
                title="Score"
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default _layout;
