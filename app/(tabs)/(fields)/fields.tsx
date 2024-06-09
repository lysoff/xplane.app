import { View, Text, TouchableOpacity, RefreshControl } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteField, useFields } from "@/services/fieldService";
import EmptyState from "@/components/EmptyState";
import FieldCard from "@/components/FieldCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated from "react-native-reanimated";
import { colors } from "@/constants/colors";
import Loader from "@/components/Loader";

const Fields = () => {
  const { data: fields, loading, refetch } = useFields();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();

    setRefreshing(false);
  };
  const handleDelete = useCallback(async (id: string) => {
    await deleteField(id);
  }, []);

  return (
    <SafeAreaView className="h-full w-full bg-primary  items-center justify-center">
      {loading ? (
        <Loader isLoading={true} />
      ) : (
        <Animated.FlatList
          className="w-full"
          data={fields}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <FieldCard field={item} onDelete={handleDelete} />
          )}
          ListHeaderComponent={() => (
            <View className="flex my-6 px-4 space-y-6 w-full">
              <View className="flex justify-between items-start flex-row mb-6 w-full">
                <View>
                  <Text className="font-pmedium text-sm text-gray-100">
                    Welcome Back
                  </Text>
                  <Text className="text-2xl font-psemibold text-white">
                    Xplane
                  </Text>
                </View>
              </View>

              <View className="absolute right-1 -top-4">
                <TouchableOpacity onPress={() => router.push("/create")}>
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
          refreshControl={
            <RefreshControl
              tintColor={colors.gray[100]}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Fields;
