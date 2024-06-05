import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFields } from "@/services/fieldService";
import EmptyState from "@/components/EmptyState";
import FieldCard from "@/components/FieldCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Fields = () => {
  const { data: fields, loading, refetch } = useFields();

  return (
    <>
      <SafeAreaView className="h-full  w-full bg-primary  items-center justify-center">
        <FlatList
          data={fields}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <FieldCard field={item} />}
          ListHeaderComponent={() => (
            <View className="flex my-6 px-4 space-y-6 w-full">
              <View className="flex justify-between items-start flex-row mb-6  w-full">
                <View>
                  <Text className="font-pmedium text-sm text-gray-100">
                    Welcome Back
                  </Text>
                  <Text className="text-2xl font-psemibold text-white">
                    Xplane
                  </Text>
                </View>
              </View>

              <View className="absolute -right-1 -top-4">
                <TouchableOpacity>
                  <MaterialCommunityIcons
                    name="plus-circle"
                    color="#FF9C01"
                    size={50}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Fields Found"
              subtitle="No fields created yet"
            />
          )}
        />
      </SafeAreaView>
      <StatusBar style="light" />
    </>
  );
};

export default Fields;
