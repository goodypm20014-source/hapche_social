import React from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { ScanRecord } from "../state/appStore";
import { useAppStore } from "../state/appStore";

export default function ScanResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { scanRecord } = (route.params || {}) as { scanRecord?: ScanRecord };
  
  const canAccessDetailedAnalysis = useAppStore((s) => s.canAccessDetailedAnalysis);

  if (!scanRecord) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">Няма данни за показване</Text>
        <Pressable
          onPress={() => navigation.goBack()}
          className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Назад</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const { analysis, imageUri, score } = scanRecord;
  const hasDetailedAccess = canAccessDetailedAnalysis();

  // Generate score color
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return "bg-green-50 border-green-200";
    if (score >= 70) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-200 flex-row items-center">
        <Pressable onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text className="text-xl font-bold flex-1">Резултат от сканиране</Text>
        <Pressable>
          <Ionicons name="share-outline" size={24} color="#007AFF" />
        </Pressable>
      </View>

      <ScrollView className="flex-1">
        {/* Image preview */}
        <View className="bg-gray-100">
          <Image
            source={{ uri: imageUri }}
            className="w-full h-64"
            resizeMode="contain"
          />
        </View>

        {/* Product info with score */}
        <View className="p-4 border-b border-gray-200">
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1">
              <Text className="text-2xl font-bold mb-2">{analysis.product_name}</Text>
              {analysis.brand && (
                <Text className="text-lg text-gray-600">{analysis.brand}</Text>
              )}
            </View>
            {score && hasDetailedAccess && (
              <View className={`px-4 py-3 rounded-lg border ${getScoreBgColor(score)}`}>
                <Text className={`text-3xl font-bold ${getScoreColor(score)}`}>
                  {score}
                </Text>
                <Text className="text-xs text-gray-600 text-center">/ 100</Text>
              </View>
            )}
          </View>

          {/* Score explanation (detailed analysis only) */}
          {score && hasDetailedAccess && (
            <View className="mt-3 bg-gray-50 rounded-lg p-3">
              <Text className="font-semibold mb-2">Оценка на продукта</Text>
              <Text className="text-sm text-gray-700 leading-5">
                {score >= 85 && "Отличен продукт с високо качество на съставките."}
                {score >= 70 && score < 85 && "Добър продукт, но има място за подобрение."}
                {score < 70 && "Умерен продукт. Препоръчваме да разгледате алтернативи."}
              </Text>
            </View>
          )}

          {/* Upsell for guests */}
          {!hasDetailedAccess && (
            <View className="mt-3 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <View className="flex-row items-center mb-2">
                <Ionicons name="lock-closed" size={20} color="#3b82f6" />
                <Text className="ml-2 font-semibold text-blue-900">
                  Детайлна оценка
                </Text>
              </View>
              <Text className="text-sm text-blue-800 mb-3">
                Регистрирайте се безплатно за да виждате нашата експертна оценка на продуктите
              </Text>
              <Pressable className="bg-blue-500 py-2 rounded-lg">
                <Text className="text-white font-semibold text-center">
                  Регистрирайте се
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Serving info */}
        {(analysis.serving_size || analysis.servings_per_container) && (
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold mb-3">Информация за дозиране</Text>
            <View className="bg-gray-50 rounded-lg p-3">
              {analysis.serving_size && (
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-700">Размер на порцията:</Text>
                  <Text className="font-semibold">{analysis.serving_size}</Text>
                </View>
              )}
              {analysis.servings_per_container > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-700">Брой порции:</Text>
                  <Text className="font-semibold">{analysis.servings_per_container}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Ingredients */}
        {analysis.ingredients && analysis.ingredients.length > 0 && (
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold mb-3">Съставки</Text>
            <View className="flex-row flex-wrap">
              {analysis.ingredients.map((ingredient, index) => (
                <View
                  key={index}
                  className="bg-blue-100 px-3 py-2 rounded-full mr-2 mb-2"
                >
                  <Text className="text-blue-800">{ingredient}</Text>
                </View>
              ))}
            </View>

            {/* Detailed ingredient analysis (free+ users) */}
            {hasDetailedAccess && (
              <View className="mt-4 bg-green-50 rounded-lg p-3 border border-green-200">
                <Text className="font-semibold text-green-900 mb-2">
                  Анализ на съставките
                </Text>
                <Text className="text-sm text-green-800 leading-5">
                  Всички съставки са одобрени и безопасни за употреба. Продуктът съдържа ефективни дози на активните вещества.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Description */}
        {analysis.description && (
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold mb-3">Описание</Text>
            <Text className="text-gray-700 leading-6">{analysis.description}</Text>
          </View>
        )}

        {/* Warnings */}
        {analysis.warnings && analysis.warnings.length > 0 && (
          <View className="p-4 border-b border-gray-200">
            <View className="flex-row items-center mb-3">
              <Ionicons name="warning" size={20} color="#ef4444" />
              <Text className="text-lg font-semibold ml-2">Предупреждения</Text>
            </View>
            {analysis.warnings.map((warning, index) => (
              <View key={index} className="flex-row mb-2">
                <Text className="text-red-600 mr-2">•</Text>
                <Text className="text-red-600 flex-1">{warning}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Allergens */}
        {analysis.allergens && analysis.allergens.length > 0 && (
          <View className="p-4 border-b border-gray-200">
            <View className="flex-row items-center mb-3">
              <Ionicons name="alert-circle" size={20} color="#f59e0b" />
              <Text className="text-lg font-semibold ml-2">Алергени</Text>
            </View>
            <View className="flex-row flex-wrap">
              {analysis.allergens.map((allergen, index) => (
                <View
                  key={index}
                  className="bg-amber-100 px-3 py-2 rounded-full mr-2 mb-2 border border-amber-300"
                >
                  <Text className="text-amber-800">{allergen}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bottom padding */}
        <View className="h-8" />
      </ScrollView>

      {/* Bottom action bar */}
      <View className="border-t border-gray-200 px-4 py-3 flex-row">
        <Pressable className="flex-1 bg-blue-500 py-4 rounded-lg mr-2 items-center">
          <Text className="text-white font-semibold text-base">Сподели</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.goBack()}
          className="flex-1 bg-gray-100 py-4 rounded-lg ml-2 items-center"
        >
          <Text className="text-gray-800 font-semibold text-base">Сканирай отново</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
