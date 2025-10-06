import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore, SupplementCategory } from "../state/appStore";
import { useNavigation } from "@react-navigation/native";
import { moderateStack } from "../api/moderation";
import { SUPPLEMENT_CATEGORIES } from "../utils/categories";

export default function StacksScreen() {
  const navigation = useNavigation();
  const user = useAppStore((s) => s.user);
  const stacks = useAppStore((s) => s.stacks);
  const canAccessStacks = useAppStore((s) => s.canAccessStacks);
  const addStack = useAppStore((s) => s.addStack);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStackName, setNewStackName] = useState("");
  const [newStackDescription, setNewStackDescription] = useState("");
  const [newStackCategory, setNewStackCategory] = useState<SupplementCategory>("vitamins");
  const [isCreating, setIsCreating] = useState(false);

  const hasAccess = canAccessStacks();

  const handleCreateStack = async () => {
    if (!newStackName.trim()) return;
    
    setIsCreating(true);

    try {
      // AI Moderation check
      const moderation = await moderateStack(newStackName.trim(), newStackDescription.trim());
      
      if (moderation.status === "rejected") {
        Alert.alert(
          "Съдържанието не може да бъде публикувано",
          `Причина: ${moderation.reason}\n\nМоля редактирайте името или описанието.`
        );
        setIsCreating(false);
        return;
      }

      const newStack = {
        id: Date.now().toString(),
        name: newStackName.trim(),
        description: newStackDescription.trim() || undefined,
        category: newStackCategory,
        supplements: [],
        reminders: [],
        isPublic: false,
        createdBy: user.id,
        createdByName: user.name,
        likes: [],
        comments: [],
        followers: [],
        createdAt: Date.now(),
        moderation, // Store moderation result
      };
      
      addStack(newStack);
      
      if (moderation.status === "flagged") {
        Alert.alert(
          "Stack създаден",
          "Вашият stack е отбелязан за ръчна проверка и ще бъде прегледан от модератор.",
          [{ text: "OK", onPress: () => resetCreateForm() }]
        );
      } else {
        resetCreateForm();
      }
    } catch (error) {
      Alert.alert("Грешка", "Не успяхме да създадем stack. Моля опитайте отново.");
      setIsCreating(false);
    }
  };

  const resetCreateForm = () => {
    setNewStackName("");
    setNewStackDescription("");
    setNewStackCategory("vitamins");
    setShowCreateModal(false);
    setIsCreating(false);
  };

  const handleStackPress = (stackId: string) => {
    (navigation as any).navigate("StackDetail", { stackId });
  };

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
        <Pressable
          onPress={() => setShowCreateModal(true)}
          className="bg-amber-500 w-10 h-10 rounded-full items-center justify-center"
        >
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
          <Pressable
            onPress={() => setShowCreateModal(true)}
            className="bg-amber-500 px-8 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Създай Stack</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView className="flex-1 p-4">
          {stacks.map((stack) => (
            <Pressable
              key={stack.id}
              onPress={() => handleStackPress(stack.id)}
              className="bg-white rounded-xl p-4 mb-3 border border-gray-200"
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <Text className="text-lg font-bold flex-1">{stack.name}</Text>
                  {stack.isPublic && (
                    <View className="bg-blue-100 px-2 py-1 rounded mr-2">
                      <Text className="text-xs text-blue-600 font-semibold">PUBLIC</Text>
                    </View>
                  )}
                </View>
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

              {/* Social stats */}
              <View className="flex-row items-center pt-2 border-t border-gray-100">
                <View className="flex-row items-center mr-4">
                  <Ionicons name="heart" size={14} color="#ef4444" />
                  <Text className="text-xs text-gray-600 ml-1">{stack.likes.length}</Text>
                </View>
                <View className="flex-row items-center mr-4">
                  <Ionicons name="chatbubble" size={14} color="#666" />
                  <Text className="text-xs text-gray-600 ml-1">{stack.comments.length}</Text>
                </View>
                <View className="flex-row items-center mr-4">
                  <Ionicons name="eye" size={14} color="#666" />
                  <Text className="text-xs text-gray-600 ml-1">{stack.followers.length}</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="alarm-outline" size={14} color="#666" />
                  <Text className="text-xs text-gray-600 ml-1">
                    {stack.reminders.filter((r) => r.enabled).length}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Create Stack Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 pb-8">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-bold">Нов Stack</Text>
              <Pressable onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </Pressable>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Име на stack
              </Text>
              <TextInput
                value={newStackName}
                onChangeText={setNewStackName}
                placeholder="напр. Сутрешни добавки"
                placeholderTextColor="#999"
                className="bg-gray-100 rounded-lg px-4 py-3 text-base"
                autoFocus
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Категория
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {SUPPLEMENT_CATEGORIES.map((category) => (
                  <Pressable
                    key={category.id}
                    onPress={() => setNewStackCategory(category.id)}
                    className="mr-2"
                  >
                    <View
                      className="px-3 py-2 rounded-lg flex-row items-center"
                      style={{
                        backgroundColor:
                          newStackCategory === category.id
                            ? category.color
                            : category.bgColor,
                      }}
                    >
                      <Ionicons
                        name={category.icon as any}
                        size={16}
                        color={
                          newStackCategory === category.id ? "#fff" : category.color
                        }
                      />
                      <Text
                        className="ml-1 font-semibold text-sm"
                        style={{
                          color:
                            newStackCategory === category.id ? "#fff" : category.color,
                        }}
                      >
                        {category.name}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Описание (опционално)
              </Text>
              <TextInput
                value={newStackDescription}
                onChangeText={setNewStackDescription}
                placeholder="Добави описание..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                className="bg-gray-100 rounded-lg px-4 py-3 text-base"
                style={{ textAlignVertical: "top" }}
              />
            </View>

            <Pressable
              onPress={handleCreateStack}
              disabled={!newStackName.trim() || isCreating}
              className={`py-4 rounded-lg ${
                !newStackName.trim() || isCreating ? "bg-gray-300" : "bg-amber-500"
              }`}
            >
              <Text className="text-white font-bold text-center text-lg">
                {isCreating ? "Създаване..." : "Създай Stack"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
