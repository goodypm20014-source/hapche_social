import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../state/appStore";

export default function FavoritesScreen() {
  const favorites = useAppStore((s) => s.favorites);
  const canAccessFavorites = useAppStore((s) => s.canAccessFavorites);
  const removeFavorite = useAppStore((s) => s.removeFavorite);

  const hasAccess = canAccessFavorites();

  if (!hasAccess) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="px-4 py-3 border-b border-gray-200">
          <Text className="text-2xl font-bold">Любими</Text>
        </View>
        
        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-green-100 w-24 h-24 rounded-full items-center justify-center mb-6">
            <Ionicons name="heart" size={48} color="#22c55e" />
          </View>
          <Text className="text-3xl font-bold text-center mb-3">
            Списък с любими
          </Text>
          <Text className="text-center text-gray-600 text-base leading-6 mb-8">
            Регистрирайте се безплатно за да запазвате любими съставки и да следите какво приемате
          </Text>
          <Pressable className="bg-green-500 px-10 py-4 rounded-xl">
            <Text className="text-white font-bold text-lg">
              Регистрирайте се безплатно
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="px-4 py-3 border-b border-gray-200">
        <Text className="text-2xl font-bold">Любими</Text>
      </View>

      {favorites.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text className="text-gray-400 text-lg mt-4 text-center">
            Все още нямате любими съставки
          </Text>
          <Text className="text-gray-400 text-sm mt-2 text-center">
            Сканирайте продукти и добавяйте съставките към любими
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1">
          {favorites.map((favorite) => (
            <View
              key={favorite.id}
              className="px-4 py-4 border-b border-gray-200 flex-row items-center justify-between"
            >
              <View className="flex-1">
                <Text className="text-lg font-semibold">{favorite.name}</Text>
                <Text className="text-sm text-gray-500">
                  Добавено: {new Date(favorite.addedAt).toLocaleDateString("bg-BG")}
                </Text>
              </View>
              <Pressable
                onPress={() => removeFavorite(favorite.id)}
                className="ml-4 w-10 h-10 items-center justify-center"
              >
                <Ionicons name="trash-outline" size={24} color="#ef4444" />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
