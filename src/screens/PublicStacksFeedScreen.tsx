import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore, Stack } from "../state/appStore";
import { useNavigation } from "@react-navigation/native";

export default function PublicStacksFeedScreen() {
  const navigation = useNavigation();
  const user = useAppStore((s) => s.user);
  const stacks = useAppStore((s) => s.stacks);
  const isFollowingUser = useAppStore((s) => s.isFollowingUser);

  const [filter, setFilter] = useState<"all" | "following" | "popular">("all");

  // Get all public stacks (in a real app, this would come from backend)
  const publicStacks = stacks.filter((s) => s.isPublic);

  // Apply filters
  const filteredStacks = publicStacks.filter((stack) => {
    if (filter === "following") {
      return isFollowingUser(stack.createdBy);
    }
    return true;
  });

  // Sort by popularity for "popular" filter
  const sortedStacks = [...filteredStacks].sort((a, b) => {
    if (filter === "popular") {
      return b.likes.length - a.likes.length;
    }
    return b.createdAt - a.createdAt;
  });

  const handleStackPress = (stackId: string) => {
    (navigation as any).navigate("StackDetail", { stackId });
  };

  const renderStackCard = (stack: Stack) => {
    const isOwnStack = stack.createdBy === user.id;

    return (
      <Pressable
        key={stack.id}
        onPress={() => handleStackPress(stack.id)}
        className="bg-white rounded-xl p-4 mb-3 border border-gray-200"
      >
        {/* Creator info */}
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 rounded-full bg-amber-500 items-center justify-center mr-3">
            <Text className="text-white font-bold">{stack.createdByName[0]}</Text>
          </View>
          <View className="flex-1">
            <Text className="font-semibold">{stack.createdByName}</Text>
            <Text className="text-xs text-gray-500">
              {new Date(stack.createdAt).toLocaleDateString("bg-BG")}
            </Text>
          </View>
          {isOwnStack && (
            <View className="bg-blue-100 px-2 py-1 rounded">
              <Text className="text-xs text-blue-600 font-semibold">МОЙ</Text>
            </View>
          )}
        </View>

        {/* Stack info */}
        <View className="mb-3">
          <Text className="text-lg font-bold mb-1">{stack.name}</Text>
          {stack.description && (
            <Text className="text-gray-600 text-sm leading-5" numberOfLines={2}>
              {stack.description}
            </Text>
          )}
        </View>

        {/* AI Analysis indicator */}
        {stack.aiAnalysis && (
          <View className="flex-row items-center mb-3">
            <View
              className={`w-2 h-2 rounded-full mr-2 ${
                stack.aiAnalysis.compatibility >= 80
                  ? "bg-green-500"
                  : stack.aiAnalysis.compatibility >= 60
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
            <Text className="text-sm text-gray-600">
              AI съвместимост: {stack.aiAnalysis.compatibility}%
            </Text>
          </View>
        )}

        {/* Supplements preview */}
        <View className="flex-row flex-wrap mb-3">
          {stack.supplements.slice(0, 3).map((supp, idx) => (
            <View key={idx} className="bg-gray-100 px-2 py-1 rounded mr-2 mb-1">
              <Text className="text-xs">{supp}</Text>
            </View>
          ))}
          {stack.supplements.length > 3 && (
            <View className="bg-gray-100 px-2 py-1 rounded">
              <Text className="text-xs">+{stack.supplements.length - 3}</Text>
            </View>
          )}
        </View>

        {/* Social stats */}
        <View className="flex-row items-center pt-3 border-t border-gray-100">
          <View className="flex-row items-center mr-5">
            <Ionicons name="heart" size={18} color="#ef4444" />
            <Text className="text-sm text-gray-700 ml-1 font-semibold">
              {stack.likes?.length || 0}
            </Text>
          </View>
          <View className="flex-row items-center mr-5">
            <Ionicons name="chatbubble" size={16} color="#666" />
            <Text className="text-sm text-gray-700 ml-1 font-semibold">
              {stack.comments?.length || 0}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="eye" size={18} color="#666" />
            <Text className="text-sm text-gray-700 ml-1 font-semibold">
              {stack.followers?.length || 0} следят
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold">Открий Стакове</Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color="#666" />
          </Pressable>
        </View>

        {/* Filter tabs */}
        <View className="flex-row">
          <Pressable
            onPress={() => setFilter("all")}
            className={`flex-1 py-2 border-b-2 ${
              filter === "all" ? "border-amber-500" : "border-transparent"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                filter === "all" ? "text-amber-500" : "text-gray-500"
              }`}
            >
              Всички
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setFilter("following")}
            className={`flex-1 py-2 border-b-2 ${
              filter === "following" ? "border-amber-500" : "border-transparent"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                filter === "following" ? "text-amber-500" : "text-gray-500"
              }`}
            >
              Следвани
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setFilter("popular")}
            className={`flex-1 py-2 border-b-2 ${
              filter === "popular" ? "border-amber-500" : "border-transparent"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                filter === "popular" ? "text-amber-500" : "text-gray-500"
              }`}
            >
              Популярни
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      {sortedStacks.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="layers-outline" size={64} color="#ccc" />
          <Text className="text-gray-400 text-lg mt-4 text-center">
            {filter === "following"
              ? "Все още не следвате никого"
              : "Няма публични стакове"}
          </Text>
          <Text className="text-gray-400 text-sm mt-2 text-center">
            {filter === "following"
              ? "Открийте потребители и следвайте техните стакове"
              : "Бъдете първите, които споделят stack"}
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 p-4">
          {sortedStacks.map(renderStackCard)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
