import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../state/appStore";

export default function DatabaseScreen() {
  const user = useAppStore((s) => s.user);
  const canAccessFullDatabase = useAppStore((s) => s.canAccessFullDatabase);
  const [searchQuery, setSearchQuery] = useState("");

  const hasAccess = canAccessFullDatabase();

  // Mock database products
  const mockProducts = [
    {
      id: "1",
      name: "BCAA 2:1:1",
      brand: "Optimum Nutrition",
      category: "Аминокиселини",
      score: 92,
      newForUser: true,
    },
    {
      id: "2",
      name: "Whey Protein Isolate",
      brand: "Dymatize",
      category: "Протеини",
      score: 88,
      newForUser: false,
    },
    {
      id: "3",
      name: "Omega-3 Fish Oil",
      brand: "Nordic Naturals",
      category: "Мазнини",
      score: 95,
      newForUser: true,
    },
  ];

  // Count new products for user (based on health profile)
  const newProductsCount = mockProducts.filter((p) => p.newForUser).length;

  if (!hasAccess) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="px-4 py-3 border-b border-gray-200">
          <Text className="text-2xl font-bold">Библиотека</Text>
        </View>

        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-blue-100 w-24 h-24 rounded-full items-center justify-center mb-6">
            <Ionicons name="library" size={48} color="#3b82f6" />
          </View>
          <Text className="text-3xl font-bold text-center mb-3">
            База от добавки
          </Text>
          <Text className="text-center text-gray-600 text-base leading-6 mb-4">
            Достъп до пълната база от хиляди добавки, филтрирани по вашия здравен профил
          </Text>

          <View className="bg-blue-50 rounded-lg p-4 mb-6 w-full">
            <View className="flex-row items-center mb-2">
              <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
              <Text className="ml-2 text-sm">Детайлни анализи на съставки</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
              <Text className="ml-2 text-sm">Персонализирани препоръки</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
              <Text className="ml-2 text-sm">Нотификации за нови продукти</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
              <Text className="ml-2 text-sm">Филтриране по здравен профил</Text>
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
              : "Само за Premium потребители"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header with notifications */}
      <View className="px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold">Библиотека</Text>
          {newProductsCount > 0 && (
            <View className="bg-red-500 px-2 py-1 rounded-full min-w-[24px] items-center">
              <Text className="text-white font-bold text-xs">{newProductsCount}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Search bar */}
      <View className="px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Търсене по име, марка, съставка..."
            className="flex-1 ml-2 text-base"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* New products banner */}
      {newProductsCount > 0 && (
        <View className="mx-4 my-3 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <View className="flex-row items-center">
            <Ionicons name="sparkles" size={24} color="#3b82f6" />
            <View className="flex-1 ml-3">
              <Text className="font-semibold text-blue-900">
                {newProductsCount} нови продукти за вас
              </Text>
              <Text className="text-sm text-blue-700">
                Базирани на вашия здравен профил
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Product list */}
      <ScrollView className="flex-1">
        {mockProducts.map((product) => (
          <Pressable
            key={product.id}
            className="px-4 py-4 border-b border-gray-200 flex-row items-center"
          >
            {/* Product info */}
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-lg font-bold flex-1">{product.name}</Text>
                {product.newForUser && (
                  <View className="bg-blue-500 px-2 py-0.5 rounded-full">
                    <Text className="text-white text-xs font-bold">НОВО</Text>
                  </View>
                )}
              </View>
              <Text className="text-sm text-gray-600 mb-1">{product.brand}</Text>
              <View className="flex-row items-center">
                <Text className="text-xs text-gray-500 mr-3">{product.category}</Text>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Text className="text-xs font-semibold ml-1">{product.score}/100</Text>
                </View>
              </View>
            </View>

            {/* Arrow */}
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
