import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Image, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../state/appStore";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const user = useAppStore((s) => s.user);
  const scans = useAppStore((s) => s.scans);
  const favorites = useAppStore((s) => s.favorites);
  const stacks = useAppStore((s) => s.stacks);
  const friends = useAppStore((s) => s.friends);
  const subscribeToPremium = useAppStore((s) => s.subscribeToPremium);
  const registerUser = useAppStore((s) => s.registerUser);
  const addMockData = useAppStore((s) => s.addMockData);
  const setUserTier = useAppStore((s) => s.setUserTier);
  const removeFriend = useAppStore((s) => s.removeFriend);
  const acceptFriendRequest = useAppStore((s) => s.acceptFriendRequest);
  const [showFriendsModal, setShowFriendsModal] = useState(false);

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
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-between bg-white" style={{ paddingTop: 50 }}>
        <Text className="text-2xl font-bold">Профил</Text>
        {user.tier !== "guest" && (
          <Pressable onPress={() => (navigation as any).navigate("EditProfile")}>
            <Ionicons name="create-outline" size={24} color="#3b82f6" />
          </Pressable>
        )}
      </View>

      <ScrollView className="flex-1">
        {/* Profile info */}
        <View className="items-center py-8 border-b border-gray-200">
          {user.profilePhotoUri ? (
            <Image
              source={{ uri: user.profilePhotoUri }}
              className="w-24 h-24 rounded-full mb-4"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-blue-500 items-center justify-center mb-4">
              <Text className="text-white text-4xl font-bold">{user.name[0]}</Text>
            </View>
          )}
          <Text className="text-2xl font-bold mb-1">{user.name}</Text>
          {user.bio && (
            <Text className="text-gray-600 text-center px-8 mb-2">{user.bio}</Text>
          )}
          {user.email && user.tier !== "guest" && (
            <View className="flex-row items-center">
              <Ionicons name="mail" size={14} color="#666" />
              <Text className="text-gray-500 text-sm ml-1">{user.email}</Text>
            </View>
          )}
          <View className="flex-row items-center">
          {user.tier !== "guest" && user.rating > 0 && (
            <View className="flex-row items-center bg-yellow-100 px-3 py-1 rounded-full">
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text className="ml-1 text-xs font-semibold text-yellow-700">
                {user.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
          
          {/* Badges */}
          {user.tier !== "guest" && user.badges.length > 0 && (
            <View className="mt-4 flex-row flex-wrap justify-center">
              {user.badges.slice(0, 3).map((badge) => (
                <View key={badge.id} className="bg-blue-100 rounded-full px-3 py-1 m-1 flex-row items-center">
                  <Ionicons name={badge.icon as any} size={14} color="#3b82f6" />
                  <Text className="ml-1 text-xs font-semibold text-blue-700">{badge.name}</Text>
                </View>
              ))}
            </View>
          )}
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
              <Text className="text-3xl font-bold text-amber-500">{stacks.length}</Text>
              <Text className="text-sm text-gray-600 mt-1">Стакове</Text>
            </View>
            {user.tier !== "guest" && (
              <Pressable onPress={() => setShowFriendsModal(true)} className="items-center">
                <Text className="text-3xl font-bold text-purple-500">
                  {friends.filter((f) => f.status === "accepted").length}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">Приятели</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Personal data section */}
        {user.tier !== "guest" && (
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-bold mb-4">Моите данни</Text>
            
            <Pressable
              onPress={() => (navigation as any).navigate("Favorites")}
              className="flex-row items-center justify-between py-3 border-b border-gray-100"
            >
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-pink-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="heart" size={20} color="#ec4899" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-base">Любими съставки</Text>
                  <Text className="text-sm text-gray-500">{favorites.length} записа</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </Pressable>

            {user.tier === "premium" && (
              <Pressable
                onPress={() => (navigation as any).navigate("Stacks")}
                className="flex-row items-center justify-between py-3 border-b border-gray-100"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                    <Ionicons name="layers" size={20} color="#8b5cf6" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-base">Мои стакове</Text>
                    <Text className="text-sm text-gray-500">{stacks.length} стака</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </Pressable>
            )}

            <Pressable
              onPress={() => (navigation as any).navigate("PublicStacksFeed")}
              className="flex-row items-center justify-between py-3"
            >
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-amber-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="globe" size={20} color="#f59e0b" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-base">Открий Стакове</Text>
                  <Text className="text-sm text-gray-500">Споделени от общността</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </Pressable>
          </View>
        )}

        {/* Tier benefits and CTA */}
        {user.tier === "guest" && (
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-bold mb-4">Станете член</Text>
            <View className="bg-green-50 rounded-lg p-4 mb-3 border border-green-200">
              <Text className="font-semibold text-green-900 text-lg mb-2">
                FREE регистрация
              </Text>
              <View>
                <View className="flex-row items-center mb-3">
                  <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                  <Text className="ml-2 text-sm">Пълен достъп до социалния feed</Text>
                </View>
                <View className="flex-row items-center mb-3">
                  <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                  <Text className="ml-2 text-sm">Детайлни анализи с оценки</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                  <Text className="ml-2 text-sm">Списък с любими съставки</Text>
                </View>
              </View>
              <Pressable
                onPress={() => (navigation as any).navigate("Registration")}
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
              <View>
                <View className="flex-row items-center mb-2">
                  <Ionicons name="star" size={20} color="#f59e0b" />
                  <Text className="ml-2 text-sm">Пълна база със съставки</Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Ionicons name="star" size={20} color="#f59e0b" />
                  <Text className="ml-2 text-sm">Stack builder с AI проверка</Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Ionicons name="star" size={20} color="#f59e0b" />
                  <Text className="ml-2 text-sm">Ремайндъри и нотификации</Text>
                </View>
                <View className="flex-row items-center mb-2">
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
              <View className="mb-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="star" size={20} color="#f59e0b" />
                  <Text className="ml-2 text-sm">Пълна база със съставки</Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Ionicons name="star" size={20} color="#f59e0b" />
                  <Text className="ml-2 text-sm">Stack builder с AI проверка</Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Ionicons name="star" size={20} color="#f59e0b" />
                  <Text className="ml-2 text-sm">Ремайндъри и нотификации</Text>
                </View>
                <View className="flex-row items-center mb-2">
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
          <View>
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

        {/* Dev Tools - For Testing */}
        <View className="p-4 border-b border-gray-200 bg-gray-50">
          <Text className="text-lg font-bold mb-4">🛠️ Dev Tools (For Testing)</Text>
          
          <View>
            <View className="flex-row mb-2">
              <Pressable
                onPress={() => setUserTier("guest")}
                className="flex-1 bg-gray-400 py-2 rounded-lg mr-2"
              >
                <Text className="text-white font-semibold text-center text-sm">
                  Switch to Guest
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  registerUser("demo@example.com", "Demo User");
                }}
                className="flex-1 bg-green-500 py-2 rounded-lg mr-2"
              >
                <Text className="text-white font-semibold text-center text-sm">
                  Switch to Free
                </Text>
              </Pressable>
              <Pressable
                onPress={subscribeToPremium}
                className="flex-1 bg-amber-500 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold text-center text-sm">
                  Switch to Premium
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={addMockData}
              className="bg-blue-500 py-3 rounded-lg mt-2"
            >
              <Text className="text-white font-semibold text-center">
                Add Mock Data (Stacks, Badges, Favorites)
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Friends List Modal */}
      <Modal visible={showFriendsModal} transparent animationType="slide">
        <SafeAreaView className="flex-1 bg-white">
          {/* Header */}
          <View className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
            <Text className="text-2xl font-bold">Приятели</Text>
            <Pressable onPress={() => setShowFriendsModal(false)}>
              <Ionicons name="close" size={28} color="#666" />
            </Pressable>
          </View>

          <ScrollView className="flex-1">
            {/* Accepted Friends */}
            {friends.filter((f) => f.status === "accepted").length > 0 && (
              <View className="px-4 py-4">
                <Text className="text-lg font-bold mb-3">
                  Мои приятели ({friends.filter((f) => f.status === "accepted").length})
                </Text>
                {friends
                  .filter((f) => f.status === "accepted")
                  .map((friend) => (
                    <View
                      key={friend.id}
                      className="flex-row items-center justify-between py-3 border-b border-gray-100"
                    >
                      <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-3">
                          <Text className="text-white font-bold text-lg">
                            {friend.name[0]}
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text className="font-semibold text-base">{friend.name}</Text>
                          <Text className="text-sm text-gray-500">
                            Приятели от{" "}
                            {new Date(friend.since).toLocaleDateString("bg-BG", {
                              month: "long",
                              year: "numeric",
                            })}
                          </Text>
                        </View>
                      </View>
                      <Pressable
                        onPress={() => {
                          removeFriend(friend.id);
                        }}
                        className="ml-2"
                      >
                        <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
                      </Pressable>
                    </View>
                  ))}
              </View>
            )}

            {/* Pending Friend Requests */}
            {friends.filter((f) => f.status === "pending").length > 0 && (
              <View className="px-4 py-4 bg-gray-50">
                <Text className="text-lg font-bold mb-3">
                  Заявки за приятелство ({friends.filter((f) => f.status === "pending").length})
                </Text>
                {friends
                  .filter((f) => f.status === "pending")
                  .map((friend) => (
                    <View
                      key={friend.id}
                      className="bg-white rounded-lg p-3 mb-3 border border-gray-200"
                    >
                      <View className="flex-row items-center mb-3">
                        <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-3">
                          <Text className="text-white font-bold text-lg">
                            {friend.name[0]}
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text className="font-semibold text-base">{friend.name}</Text>
                          <Text className="text-sm text-gray-500">
                            Изпратена заявка
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row">
                        <Pressable
                          onPress={() => {
                            acceptFriendRequest(friend.id);
                          }}
                          className="flex-1 bg-blue-500 py-2 rounded-lg mr-2"
                        >
                          <Text className="text-white font-semibold text-center">
                            Приеми
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            removeFriend(friend.id);
                          }}
                          className="flex-1 bg-gray-200 py-2 rounded-lg"
                        >
                          <Text className="text-gray-700 font-semibold text-center">
                            Откажи
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  ))}
              </View>
            )}

            {/* Empty state */}
            {friends.length === 0 && (
              <View className="flex-1 items-center justify-center px-8 py-16">
                <Ionicons name="people-outline" size={64} color="#ccc" />
                <Text className="text-gray-400 text-lg mt-4 text-center">
                  Все още нямате приятели
                </Text>
                <Text className="text-gray-400 text-sm mt-2 text-center">
                  Започнете да споделяте добавки и stacks, за да се свържете с други потребители
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
