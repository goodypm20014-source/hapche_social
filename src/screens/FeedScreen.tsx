import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../state/appStore";

export default function FeedScreen() {
  const user = useAppStore((s) => s.user);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showMockBanner, setShowMockBanner] = useState(true);

  const isGuest = user.tier === "guest";

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
      rating: 4.5,
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
      rating: 5.0,
    },
    {
      id: "3",
      username: "Георги Иванов",
      timestamp: "Преди 1 ден",
      supplementName: "Creatine Monohydrate",
      brand: "MyProtein",
      review: "Чиста креатин на страхотна цена. Резултатите са видими след 2 седмици.",
      likes: 67,
      comments: 23,
      rating: 4.8,
    },
  ];

  const handleTeaserTap = () => {
    setShowRegistrationModal(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
        <Text className="text-2xl font-bold">Новини</Text>
        {isGuest && (
          <View className="bg-gray-200 px-3 py-1 rounded-full">
            <Text className="text-xs font-semibold text-gray-700">ГОСТ</Text>
          </View>
        )}
      </View>

      <ScrollView className="flex-1">
        {/* Debug tier info */}
        <View className="bg-purple-100 p-3 border-b border-purple-200">
          <Text className="text-sm font-mono">
            DEBUG: User Tier = "{user.tier}" | isGuest = {isGuest ? "true" : "false"}
          </Text>
        </View>

        {/* Mock mode info banner */}
        {showMockBanner && (
          <View className="bg-amber-50 border-b border-amber-200 p-4">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={24} color="#f59e0b" />
              <View className="flex-1 ml-3">
                <Text className="font-semibold text-amber-900 mb-1">
                  Demo режим активен
                </Text>
                <Text className="text-sm text-amber-800 leading-5">
                  Сканирането работи с примерни данни. Всеки път ще получавате различна добавка.
                </Text>
              </View>
              <Pressable onPress={() => setShowMockBanner(false)} className="ml-2">
                <Ionicons name="close" size={20} color="#f59e0b" />
              </Pressable>
            </View>
          </View>
        )}

        {/* Feed posts with teaser overlay for guests */}
        <View style={{ position: "relative" }}>
          {mockPosts.map((post, index) => (
            <View
              key={post.id}
              className="border-b border-gray-200 bg-white"
              style={{ opacity: isGuest && index > 0 ? 0.3 : 1 }}
            >
              {/* Post header */}
              <View className="flex-row items-center px-4 py-3">
                <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center mr-3">
                  <Text className="text-white font-bold">{post.username[0]}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold">{post.username}</Text>
                  <Text className="text-xs text-gray-500">{post.timestamp}</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={16} color="#f59e0b" />
                  <Text className="ml-1 font-semibold">{post.rating}</Text>
                </View>
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

          {/* Teaser overlay for guests - peek at the top */}
          {isGuest && (
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: "transparent",
              }}
              pointerEvents="box-none"
            >
              {/* Small peek window at top (5mm ≈ 60px) */}
              <View style={{ height: 60 }} pointerEvents="none" />

              {/* Blur overlay covering rest */}
              <Pressable
                onPress={handleTeaserTap}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: -4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <View style={{ position: "absolute", right: 16, top: 16, zIndex: 20 }}>
                  <Pressable
                    onPress={handleTeaserTap}
                    className="w-10 h-10 rounded-full bg-gray-800/10 items-center justify-center"
                  >
                    <Ionicons name="close" size={24} color="#000" />
                  </Pressable>
                </View>

                <View className="flex-1 items-center justify-center px-8">
                  <View className="bg-blue-100 w-20 h-20 rounded-full items-center justify-center mb-6">
                    <Ionicons name="lock-closed" size={40} color="#3b82f6" />
                  </View>
                  <Text className="text-3xl font-bold text-center mb-3">
                    Откриjте повече
                  </Text>
                  <Text className="text-center text-gray-600 text-base leading-6 mb-8">
                    Регистрирайте се безплатно за достъп до пълния feed, детайлни анализи и любими съставки
                  </Text>
                  <Pressable
                    onPress={handleTeaserTap}
                    className="bg-blue-500 px-10 py-4 rounded-xl shadow-lg"
                  >
                    <Text className="text-white font-bold text-lg">
                      Регистрирайте се безплатно
                    </Text>
                  </Pressable>

                  <View className="mt-8 flex-row items-center">
                    <View className="h-px bg-gray-300 flex-1" />
                    <Text className="text-gray-400 text-sm px-4">или продължете като гост</Text>
                    <View className="h-px bg-gray-300 flex-1" />
                  </View>
                </View>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Registration Modal */}
      <Modal visible={showRegistrationModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 pb-8">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-bold">Регистрация</Text>
              <Pressable onPress={() => setShowRegistrationModal(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </Pressable>
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 text-base leading-6 mb-4">
                Създайте безплатен акаунт и получете достъп до:
              </Text>
              <View className="space-y-3">
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                  <Text className="ml-3 text-gray-700">Пълен достъп до социалния feed</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                  <Text className="ml-3 text-gray-700">Детайлни анализи с оценки</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                  <Text className="ml-3 text-gray-700">Списък с любими съставки</Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={() => {
                setShowRegistrationModal(false);
                // TODO: Navigate to registration screen
              }}
              className="bg-blue-500 py-4 rounded-lg mb-3"
            >
              <Text className="text-white font-bold text-center text-lg">
                Започнете безплатно
              </Text>
            </Pressable>

            <Text className="text-center text-sm text-gray-500">
              Вече имате акаунт?{" "}
              <Text className="text-blue-500 font-semibold">Влезте</Text>
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
