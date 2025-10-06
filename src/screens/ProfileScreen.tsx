import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../state/appStore";

export default function ProfileScreen() {
  const user = useAppStore((s) => s.user);
  const scans = useAppStore((s) => s.scans);
  const favorites = useAppStore((s) => s.favorites);
  const stacks = useAppStore((s) => s.stacks);
  const subscribeToPremium = useAppStore((s) => s.subscribeToPremium);
  const registerUser = useAppStore((s) => s.registerUser);

  const getTierLabel = () => {
    switch (user.tier) {
      case "guest":
        return "Гост";
      case "free":
        return "FREE";
      case "premium":
        return "PREMIUM";
      default:
        return "Гост";
    }
  };

  const getTierColor = () => {
    switch (user.tier) {
      case "guest":
        return "bg-gray-400";
      case "free":
        return "bg-green-500";
      case "premium":
        return "bg-amber-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-200">
        <Text className="text-2xl font-bold">Профил</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Profile info */}
        <View className="items-center py-8 border-b border-gray-200">
          <View className="w-24 h-24 rounded-full bg-blue-500 items-center justify-center mb-4">
            <Text className="text-white text-4xl font-bold">{user.name[0]}</Text>
          </View>
          <Text className="text-2xl font-bold mb-1">{user.name}</Text>
          {user.email && (
            <Text className="text-gray-600 mb-2">{user.email}</Text>
          )}
          <View className="flex-row items-center">
            <View className={`px-3 py-1 rounded-full ${getTierColor()}`}>
              <Text className="text-white font-semibold text-xs">
                {getTierLabel()}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="px-4 py-6 border-b border-gray-200">
          <Text className="text-lg font-bold mb-4">Статистики</Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-3xl font-bold text-blue-500">{scans.length}</Text>
              <Text className="text-sm text-gray-600 mt-1">Сканирания</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-green-500">{favorites.length}</Text>
              <Text className="text-sm text-gray-600 mt-1">Любими</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-purple-500">{stacks.length}</Text>
              <Text className="text-sm text-gray-600 mt-1">Стакове</Text>
            </View>
          </View>
        </View>

        {/* Tier benefits and CTA */}
        {user.tier === "guest" && (
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-bold mb-4">Станете член</Text>
            <View className="bg-green-50 rounded-lg p-4 mb-3 border border-green-200">
              <Text className="font-semibold text-green-900 text-lg mb-2">
                FREE регистрация
              </Text>
              <View className="space-y-2">
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                  <Text className="ml-2 text-sm">Пълен достъп до социалния feed</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                  <Text className="ml-2 text-sm">Детайлни анализи с оценки</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                  <Text className="ml-2 text-sm">Списък с любими съставки</Text>
                </View>
              </View>
              <Pressable
                onPress={() => registerUser("demo@example.com", "Demo User")}
                className="bg-green-500 py-3 rounded-lg mt-4"
              >
                <Text className="text-white font-bold text-center">
                  Регистрирайте се безплатно
                </Text>
              </Pressable>
            </View>

            <View className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <Text className="font-semibold text-amber-900 text-lg mb-2">
                PREMIUM план - €1.99/месец
              </Text>
              <View className="space-y-2">
                <View className="flex-row items-center">
                  <Ionicons name="star" size={20} color="#f59e0b" />
                  <Text className="ml-2 text-sm">Пълна база със съставки</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={20} color="#f59e0b" />
                  <Text className="ml-2 text-sm">Stack builder с AI проверка</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={20} color="#f59e0b" />
                  <Text className="ml-2 text-sm">Ремайндъри и нотификации</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={20} color="#f59e0b" />
                  <Text className="ml-2 text-sm">SMS споделяне</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={20} color="#f59e0b" />
                  <Text className="ml-2 text-sm">Без реклами</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {user.tier === "free" && (
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-bold mb-4">Надстройте до Premium</Text>
            <View className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <Text className="font-semibold text-amber-900 text-lg mb-2">
                PREMIUM план - €1.99/месец
              </Text>
              <View className="space-y-2 mb-4">
                <View className="flex-row items-center">
                  <Ionicons name="star" size={20} color="#f59e0b" />
                  <Text className="ml-2 text-sm">Пълна база със съставки</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={20} color="#f59e0b" />
                  <Text className="ml-2 text-sm">Stack builder с AI проверка</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={20} color="#f59e0b" />
                  <Text className="ml-2 text-sm">Ремайндъри и нотификации</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={20} color="#f59e0b" />
                  <Text className="ml-2 text-sm">SMS споделяне</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={20} color="#f59e0b" />
                  <Text className="ml-2 text-sm">Без реклами</Text>
                </View>
              </View>
              <Pressable
                onPress={subscribeToPremium}
                className="bg-amber-500 py-3 rounded-lg"
              >
                <Text className="text-white font-bold text-center">
                  Upgrade to Premium
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {user.tier === "premium" && (
          <View className="p-4 border-b border-gray-200">
            <View className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <View className="flex-row items-center mb-3">
                <Ionicons name="star" size={32} color="#f59e0b" />
                <View className="ml-3 flex-1">
                  <Text className="font-bold text-amber-900 text-lg">
                    Premium активен
                  </Text>
                  <Text className="text-amber-700 text-sm">
                    Благодарим ви за подкрепата!
                  </Text>
                </View>
              </View>
              <Text className="text-amber-600 text-sm">
                Вашият абонамент е активен до{" "}
                {user.subscriptionExpiresAt
                  ? new Date(user.subscriptionExpiresAt).toLocaleDateString("bg-BG")
                  : "неопределено време"}
              </Text>
            </View>
          </View>
        )}

        {/* Features list based on tier */}
        <View className="px-4 py-6">
          <Text className="text-lg font-bold mb-4">Вашите функции</Text>
          <View className="space-y-3">
            <View className="flex-row items-center py-2">
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text className="ml-3 text-gray-700">OCR сканиране на добавки</Text>
            </View>
            <View className="flex-row items-center py-2">
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text className="ml-3 text-gray-700">Кратък AI анализ</Text>
            </View>
            <View className="flex-row items-center py-2">
              <Ionicons
                name={user.tier !== "guest" ? "checkmark-circle" : "close-circle"}
                size={24}
                color={user.tier !== "guest" ? "#22c55e" : "#ef4444"}
              />
              <Text className="ml-3 text-gray-700">Пълен социален feed</Text>
            </View>
            <View className="flex-row items-center py-2">
              <Ionicons
                name={user.tier !== "guest" ? "checkmark-circle" : "close-circle"}
                size={24}
                color={user.tier !== "guest" ? "#22c55e" : "#ef4444"}
              />
              <Text className="ml-3 text-gray-700">Детайлни анализи</Text>
            </View>
            <View className="flex-row items-center py-2">
              <Ionicons
                name={user.tier === "premium" ? "checkmark-circle" : "close-circle"}
                size={24}
                color={user.tier === "premium" ? "#22c55e" : "#ef4444"}
              />
              <Text className="ml-3 text-gray-700">Stack builder</Text>
            </View>
            <View className="flex-row items-center py-2">
              <Ionicons
                name={user.tier === "premium" ? "checkmark-circle" : "close-circle"}
                size={24}
                color={user.tier === "premium" ? "#22c55e" : "#ef4444"}
              />
              <Text className="ml-3 text-gray-700">Ремайндъри</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
