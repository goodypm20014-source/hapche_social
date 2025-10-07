import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../state/appStore";
import { useNavigation } from "@react-navigation/native";

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const favorites = useAppStore((s) => s.favorites);
  const stacks = useAppStore((s) => s.stacks);
  const canAccessFavorites = useAppStore((s) => s.canAccessFavorites);
  const removeFavorite = useAppStore((s) => s.removeFavorite);
  const [selectedFavorite, setSelectedFavorite] = useState<any>(null);
  const [showStackModal, setShowStackModal] = useState(false);

  const hasAccess = canAccessFavorites();

  if (!hasAccess) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
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
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
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
            <Pressable
              key={favorite.id}
              onPress={() => setSelectedFavorite(favorite)}
              className="px-4 py-4 border-b border-gray-200"
            >
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1">
                  <Text className="text-lg font-semibold mb-1">{favorite.name}</Text>
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
              
              {favorite.analysis && (
                <View className="mt-2 bg-gray-50 rounded-lg p-3">
                  <View className="flex-row items-center mb-2">
                    <View className={`w-3 h-3 rounded-full mr-2 ${
                      favorite.analysis.overall_score >= 80 ? 'bg-green-500' :
                      favorite.analysis.overall_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <Text className="font-semibold">
                      Оценка: {favorite.analysis.overall_score}/100
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-600" numberOfLines={2}>
                    {favorite.analysis.summary}
                  </Text>
                </View>
              )}

              <Pressable
                onPress={() => {
                  setSelectedFavorite(favorite);
                  setShowStackModal(true);
                }}
                className="mt-3 bg-amber-500 py-2 px-4 rounded-lg flex-row items-center justify-center"
              >
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text className="text-white font-semibold ml-2">Добави към Stack</Text>
              </Pressable>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Add to Stack Modal */}
      <Modal visible={showStackModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 pb-8">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-bold">Избери Stack</Text>
              <Pressable onPress={() => setShowStackModal(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              {stacks.length === 0 ? (
                <View className="items-center py-8">
                  <Ionicons name="layers-outline" size={48} color="#ccc" />
                  <Text className="text-gray-400 mt-4">Няма създадени stacks</Text>
                  <Pressable
                    onPress={() => {
                      setShowStackModal(false);
                      (navigation as any).navigate("Stacks");
                    }}
                    className="mt-4 bg-amber-500 px-6 py-3 rounded-lg"
                  >
                    <Text className="text-white font-semibold">Създай Stack</Text>
                  </Pressable>
                </View>
              ) : (
                stacks.map((stack) => (
                  <Pressable
                    key={stack.id}
                    onPress={() => {
                      // Add to stack logic here
                      setShowStackModal(false);
                    }}
                    className="border border-gray-200 rounded-xl p-4 mb-3"
                  >
                    <Text className="font-bold text-lg">{stack.name}</Text>
                    <Text className="text-sm text-gray-600 mt-1">
                      {stack.supplements.length} съставки
                    </Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
