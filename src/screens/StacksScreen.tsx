import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../state/appStore";

export default function StacksScreen() {
  const user = useAppStore((s) => s.user);
  const stacks = useAppStore((s) => s.stacks);
  const canAccessStacks = useAppStore((s) => s.canAccessStacks);

  const hasAccess = canAccessStacks();

  if (!hasAccess) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="px-4 py-3 border-b border-gray-200">
          <Text className="text-2xl font-bold">Стакове</Text>
        </View>
        
        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-amber-100 w-24 h-24 rounded-full items-center justify-center mb-6">
            <Ionicons name="layers" size={48} color="#f59e0b" />
          </View>
          <Text className="text-3xl font-bold text-center mb-3">
            Stack Builder
          </Text>
          <Text className="text-center text-gray-600 text-base leading-6 mb-4">
            Създавайте персонализирани стакове от добавки с AI проверка за съвместимост и ефикасност
          </Text>
          
          <View className="bg-amber-50 rounded-lg p-4 mb-6 w-full">
            <View className="flex-row items-center mb-2">
              <Ionicons name="checkmark-circle" size={20} color="#f59e0b" />
              <Text className="ml-2 text-sm">AI анализ на съвместимостта</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons name="checkmark-circle" size={20} color="#f59e0b" />
              <Text className="ml-2 text-sm">Предупреждения за взаимодействия</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons name="checkmark-circle" size={20} color="#f59e0b" />
              <Text className="ml-2 text-sm">Ремайндъри за прием</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="#f59e0b" />
              <Text className="ml-2 text-sm">SMS споделяне със специалисти</Text>
            </View>
          </View>

          <Pressable className="bg-amber-500 px-10 py-4 rounded-xl mb-3">
            <Text className="text-white font-bold text-lg">
              Upgrade to Premium - €1.99/месец
            </Text>
          </Pressable>
          
          <Text className="text-center text-sm text-gray-500">
            {user.tier === "guest" 
              ? "Регистрирайте се безплатно, после upgrade до Premium"
              : "Само за Premium потребители"
            }
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
        <Text className="text-2xl font-bold">Стакове</Text>
        <Pressable className="bg-amber-500 w-10 h-10 rounded-full items-center justify-center">
          <Ionicons name="add" size={28} color="white" />
        </Pressable>
      </View>

      {stacks.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="layers-outline" size={64} color="#ccc" />
          <Text className="text-gray-400 text-lg mt-4 text-center">
            Все още нямате създадени стакове
          </Text>
          <Text className="text-gray-400 text-sm mt-2 text-center mb-6">
            Създайте си първи stack с добавки
          </Text>
          <Pressable className="bg-amber-500 px-8 py-3 rounded-lg">
            <Text className="text-white font-semibold">Създай Stack</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView className="flex-1 p-4">
          {stacks.map((stack) => (
            <Pressable
              key={stack.id}
              className="bg-white rounded-xl p-4 mb-3 border border-gray-200"
            >
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-bold flex-1">{stack.name}</Text>
                <View className="flex-row items-center">
                  {stack.aiAnalysis && (
                    <View className="flex-row items-center mr-3">
                      <View
                        className={`w-2 h-2 rounded-full mr-1 ${
                          stack.aiAnalysis.compatibility >= 80
                            ? "bg-green-500"
                            : stack.aiAnalysis.compatibility >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                      <Text className="text-xs text-gray-600">
                        {stack.aiAnalysis.compatibility}%
                      </Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </View>
              </View>

              <View className="flex-row flex-wrap mb-2">
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

              <View className="flex-row items-center">
                <Ionicons name="alarm-outline" size={16} color="#666" />
                <Text className="text-xs text-gray-600 ml-1">
                  {stack.reminders.filter((r) => r.enabled).length} активни напомняния
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
