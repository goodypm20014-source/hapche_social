import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../state/appStore";

export default function ProfileScreen() {
  const user = useAppStore((s) => s.user);
  const scans = useAppStore((s) => s.scans);
  const upgradeToPro = useAppStore((s) => s.upgradeToPro);

  const scansRemaining = user.isPro ? "Неограничени" : `${5 - user.scansThisMonth} останали`;

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
          <View className="flex-row items-center">
            <View
              className={`px-3 py-1 rounded-full ${
                user.isPro ? "bg-amber-500" : "bg-gray-300"
              }`}
            >
              <Text className="text-white font-semibold text-xs">
                {user.isPro ? "PRO" : "FREE"}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="px-4 py-6 border-b border-gray-200">
          <Text className="text-lg font-bold mb-4">Статистики</Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-3xl font-bold text-blue-500">{user.totalScans}</Text>
              <Text className="text-sm text-gray-600 mt-1">Общо сканирания</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-green-500">{scans.length}</Text>
              <Text className="text-sm text-gray-600 mt-1">Запазени</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-purple-500">
                {user.scansThisMonth}
              </Text>
              <Text className="text-sm text-gray-600 mt-1">Този месец</Text>
            </View>
          </View>
        </View>

        {/* Subscription status */}
        <View className="px-4 py-6 border-b border-gray-200">
          <Text className="text-lg font-bold mb-4">Абонамент</Text>
          <View className="bg-gray-50 rounded-lg p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-semibold">Текущ план</Text>
              <Text className="text-gray-600">{user.isPro ? "Pro" : "Free"}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold">Сканирания</Text>
              <Text className="text-gray-600">{scansRemaining}</Text>
            </View>
          </View>

          {!user.isPro && (
            <Pressable
              onPress={upgradeToPro}
              className="bg-amber-500 rounded-lg py-4 items-center mt-4"
            >
              <Text className="text-white font-bold text-lg">Upgrade to Pro</Text>
              <Text className="text-white text-sm mt-1">
                Неограничени сканирания и още функции
              </Text>
            </Pressable>
          )}

          {user.isPro && (
            <View className="bg-green-50 rounded-lg p-4 mt-4 border border-green-200">
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                <Text className="ml-2 text-green-700 font-semibold">
                  Вие сте Pro потребител!
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Features list */}
        <View className="px-4 py-6">
          <Text className="text-lg font-bold mb-4">Функции</Text>
          <View className="space-y-3">
            <View className="flex-row items-center py-2">
              <Ionicons
                name={user.isPro ? "checkmark-circle" : "close-circle"}
                size={24}
                color={user.isPro ? "#22c55e" : "#ef4444"}
              />
              <Text className="ml-3 text-gray-700">Неограничени OCR сканирания</Text>
            </View>
            <View className="flex-row items-center py-2">
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text className="ml-3 text-gray-700">AI анализ на добавки</Text>
            </View>
            <View className="flex-row items-center py-2">
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text className="ml-3 text-gray-700">Достъп до общността</Text>
            </View>
            <View className="flex-row items-center py-2">
              <Ionicons
                name={user.isPro ? "checkmark-circle" : "close-circle"}
                size={24}
                color={user.isPro ? "#22c55e" : "#ef4444"}
              />
              <Text className="ml-3 text-gray-700">Експорт на данни</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
