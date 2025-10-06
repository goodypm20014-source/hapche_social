import React from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../state/appStore";

export default function FeedScreen() {
  const scans = useAppStore((s) => s.scans);

  // Mock social posts for demo
  const mockPosts = [
    {
      id: "1",
      username: "Иван Петров",
      timestamp: "Преди 2 часа",
      supplementName: "BCAA 2:1:1",
      brand: "Optimum Nutrition",
      review: "Отличен продукт! Забелязвам по-бърз възстановяване след тренировка.",
      likes: 24,
      comments: 8,
    },
    {
      id: "2",
      username: "Мария Георгиева",
      timestamp: "Преди 5 часа",
      supplementName: "Omega-3 Fish Oil",
      brand: "Nordic Naturals",
      review: "Препоръчвам! Високо качество и без неприятен вкус.",
      likes: 45,
      comments: 12,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-200">
        <Text className="text-2xl font-bold">Новини</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Your recent scans section */}
        {scans.length > 0 && (
          <View className="px-4 py-4 bg-blue-50 border-b border-blue-100">
            <Text className="text-lg font-semibold mb-2">Вашите сканирания</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {scans.slice(0, 5).map((scan) => (
                <View key={scan.id} className="mr-3 w-32">
                  <View className="bg-white rounded-lg p-2 shadow-sm">
                    <Image
                      source={{ uri: scan.imageUri }}
                      className="w-28 h-28 rounded-md mb-2"
                      resizeMode="cover"
                    />
                    <Text className="text-xs font-medium" numberOfLines={2}>
                      {scan.analysis.product_name}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Feed posts */}
        {mockPosts.map((post) => (
          <View key={post.id} className="border-b border-gray-200 bg-white">
            {/* Post header */}
            <View className="flex-row items-center px-4 py-3">
              <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center mr-3">
                <Text className="text-white font-bold">{post.username[0]}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold">{post.username}</Text>
                <Text className="text-xs text-gray-500">{post.timestamp}</Text>
              </View>
              <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
            </View>

            {/* Post content */}
            <View className="px-4 pb-3">
              <View className="bg-gray-50 rounded-lg p-3 mb-3">
                <Text className="font-bold text-lg">{post.supplementName}</Text>
                <Text className="text-sm text-gray-600">{post.brand}</Text>
              </View>
              <Text className="text-base leading-6">{post.review}</Text>
            </View>

            {/* Post actions */}
            <View className="flex-row px-4 py-3 border-t border-gray-100">
              <Pressable className="flex-row items-center mr-6">
                <Ionicons name="heart-outline" size={24} color="#666" />
                <Text className="ml-2 text-gray-600">{post.likes}</Text>
              </Pressable>
              <Pressable className="flex-row items-center">
                <Ionicons name="chatbubble-outline" size={22} color="#666" />
                <Text className="ml-2 text-gray-600">{post.comments}</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {/* Empty state if no posts */}
        {mockPosts.length === 0 && scans.length === 0 && (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="newspaper-outline" size={64} color="#ccc" />
            <Text className="text-gray-400 text-lg mt-4">Все още няма публикации</Text>
            <Text className="text-gray-400 text-sm mt-2">Сканирайте добавка и споделете опит</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
