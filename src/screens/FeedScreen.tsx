import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore, SupplementCategory } from "../state/appStore";
import { useNavigation } from "@react-navigation/native";
import { SUPPLEMENT_CATEGORIES } from "../utils/categories";

interface FeedPost {
  id: string;
  username: string;
  userId: string;
  timestamp: number;
  supplementName: string;
  brand: string;
  review: string;
  likes: number;
  comments: number;
  rating: number;
  category: SupplementCategory;
  hasUnreadComments?: boolean;
}

export default function FeedScreen() {
  const navigation = useNavigation();
  const user = useAppStore((s) => s.user);
  const getUnreadMessagesCount = useAppStore((s) => s.getUnreadMessagesCount);
  const getUnreadNotificationsCount = useAppStore((s) => s.getUnreadNotificationsCount);
  const [selectedCategory, setSelectedCategory] = useState<SupplementCategory | "all">("all");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const isGuest = user.tier === "guest";
  const unreadTotal = getUnreadMessagesCount() + getUnreadNotificationsCount();

  // Mock social posts with categories
  const mockPosts: FeedPost[] = [
    {
      id: "1",
      username: "Иван Петров",
      userId: "user1",
      timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
      supplementName: "BCAA 2:1:1",
      brand: "Optimum Nutrition",
      review: "Отличен продукт! Забелязвам по-бърз възстановяване след тренировка.",
      likes: 24,
      comments: 8,
      rating: 4.5,
      category: "proteins",
      hasUnreadComments: true,
    },
    {
      id: "2",
      username: "Мария Георгиева",
      userId: "user2",
      timestamp: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
      supplementName: "Omega-3 Fish Oil",
      brand: "Nordic Naturals",
      review: "Препоръчвам! Високо качество и без неприятен вкус.",
      likes: 45,
      comments: 12,
      rating: 5.0,
      category: "probiotics",
    },
    {
      id: "3",
      username: "Георги Иванов",
      userId: "user3",
      timestamp: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
      supplementName: "Creatine Monohydrate",
      brand: "MyProtein",
      review: "Чиста креатин на страхотна цена. Резултатите са видими след 2 седмици.",
      likes: 67,
      comments: 23,
      rating: 4.8,
      category: "proteins",
    },
    {
      id: "4",
      username: "Елена Димитрова",
      userId: "user4",
      timestamp: Date.now() - 3 * 60 * 60 * 1000,
      supplementName: "Vitamin D3 5000 IU",
      brand: "NOW Foods",
      review: "Супер добавка за имунитета, особено през зимата!",
      likes: 38,
      comments: 5,
      rating: 4.7,
      category: "vitamins",
      hasUnreadComments: true,
    },
    {
      id: "5",
      username: "Стоян Петков",
      userId: "user5",
      timestamp: Date.now() - 6 * 60 * 60 * 1000,
      supplementName: "Ashwagandha Extract",
      brand: "Himalaya",
      review: "Помага за стреса и съня. Виждам промяна след 2 седмици.",
      likes: 52,
      comments: 15,
      rating: 4.9,
      category: "herbs",
    },
    {
      id: "6",
      username: "Антон Георгиев",
      userId: "user6",
      timestamp: Date.now() - 12 * 60 * 60 * 1000,
      supplementName: "Multivitamin Complex",
      brand: "Centrum",
      review: "Добра комбинация за ежедневна употреба.",
      likes: 29,
      comments: 7,
      rating: 4.3,
      category: "multi",
      hasUnreadComments: true,
    },
  ];

  // Filter posts by category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === "all") {
      return mockPosts;
    }
    return mockPosts.filter((post) => post.category === selectedCategory);
  }, [selectedCategory]);

  // Sort by timestamp (newest first) or by unread comments
  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      // Prioritize posts with unread comments
      if (a.hasUnreadComments && !b.hasUnreadComments) return -1;
      if (!a.hasUnreadComments && b.hasUnreadComments) return 1;
      // Then sort by timestamp
      return b.timestamp - a.timestamp;
    });
  }, [filteredPosts]);

  // Count new items per category (mock data)
  const getNewItemsCount = (categoryId: SupplementCategory | "all"): number => {
    if (categoryId === "all") {
      return mockPosts.filter((p) => p.hasUnreadComments).length;
    }
    return mockPosts.filter((p) => p.category === categoryId && p.hasUnreadComments).length;
  };

  const handleTeaserTap = () => {
    setShowRegistrationModal(true);
  };

  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `Преди ${minutes} мин`;
    if (hours < 24) return `Преди ${hours} часа`;
    return `Преди ${days} ден${days > 1 ? "а" : ""}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-end bg-white" style={{ paddingTop: 50 }}>
        {/* Messages icon like Facebook */}
        <Pressable
          onPress={() => {
            if (isGuest) {
              setShowRegistrationModal(true);
            } else {
              (navigation as any).navigate("Reminders");
            }
          }}
          className="relative"
        >
          <Ionicons name="chatbubble-ellipses-outline" size={29} color="#000" />
          {unreadTotal > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
              <Text className="text-white text-xs font-bold">{unreadTotal}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="border-b border-gray-200"
        contentContainerClassName="px-2 py-3"
        style={{ maxHeight: 60 }}
      >
        {/* All tab */}
        <Pressable
          onPress={() => setSelectedCategory("all")}
          className="mr-2"
        >
          <View
            className="px-4 py-2 rounded-full flex-row items-center"
            style={{
              backgroundColor: selectedCategory === "all" ? "#000" : "#f3f4f6",
            }}
          >
            <Ionicons
              name="grid"
              size={16}
              color={selectedCategory === "all" ? "#fff" : "#666"}
            />
            <Text
              className="ml-2 font-semibold"
              style={{ color: selectedCategory === "all" ? "#fff" : "#666" }}
            >
              Всички
            </Text>
            {getNewItemsCount("all") > 0 && (
              <View className="ml-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {getNewItemsCount("all")}
                </Text>
              </View>
            )}
          </View>
        </Pressable>

        {/* Category tabs */}
        {SUPPLEMENT_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          const newCount = getNewItemsCount(category.id);

          return (
            <Pressable
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className="mr-2"
            >
              <View
                className="px-4 py-2 rounded-full flex-row items-center"
                style={{
                  backgroundColor: isSelected ? category.color : category.bgColor,
                }}
              >
                <Ionicons
                  name={category.icon as any}
                  size={16}
                  color={isSelected ? "#fff" : category.color}
                />
                <Text
                  className="ml-2 font-semibold"
                  style={{ color: isSelected ? "#fff" : category.color }}
                >
                  {category.name}
                </Text>
                {newCount > 0 && (
                  <View className="ml-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                    <Text className="text-white text-xs font-bold">{newCount}</Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        {sortedPosts.length === 0 ? (
          <View className="items-center py-16 px-8">
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text className="text-gray-400 text-lg mt-4 text-center">
              Все още няма публикации в тази категория
            </Text>
          </View>
        ) : (
          sortedPosts.map((post, index) => {
              // For guests: make colors EXTREMELY pale/faded - almost invisible
              const textOpacity = isGuest ? 0.04 : 1;  // 4% opacity - barely visible
              const iconOpacity = isGuest ? 0.03 : 1;  // 3% opacity - almost invisible
              
              return (
                <Pressable
                  key={post.id}
                  onPress={() => isGuest && setShowRegistrationModal(true)}
                  className="border-b border-gray-200 bg-white"
                >
                  {/* Post header */}
                  <View className="flex-row items-center px-4 py-3">
                    <View 
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ 
                        backgroundColor: isGuest ? `rgba(59, 130, 246, ${iconOpacity})` : "#3b82f6"
                      }}
                    >
                      <Text 
                        className="font-bold"
                        style={{ 
                          color: isGuest ? `rgba(255, 255, 255, ${textOpacity * 3})` : "#fff"
                        }}
                      >
                        {post.username[0]}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text 
                        className="font-semibold"
                        style={{ 
                          color: isGuest ? `rgba(0, 0, 0, ${textOpacity})` : "#000"
                        }}
                      >
                        {post.username}
                      </Text>
                      <Text 
                        className="text-xs"
                        style={{ 
                          color: isGuest ? `rgba(107, 114, 128, ${textOpacity})` : "#6b7280"
                        }}
                      >
                        {formatTimestamp(post.timestamp)}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons 
                        name="star" 
                        size={16} 
                        color={isGuest ? `rgba(245, 158, 11, ${iconOpacity})` : "#f59e0b"}
                      />
                      <Text 
                        className="ml-1 font-semibold"
                        style={{ 
                          color: isGuest ? `rgba(0, 0, 0, ${textOpacity})` : "#000"
                        }}
                      >
                        {post.rating}
                      </Text>
                    </View>
                  </View>

                  {/* Post content */}
                  <View className="px-4 pb-3">
                    <View
                      className="rounded-lg p-3 mb-3"
                      style={{
                        backgroundColor: isGuest 
                          ? `rgba(243, 244, 246, ${iconOpacity})` 
                          : SUPPLEMENT_CATEGORIES.find((c) => c.id === post.category)?.bgColor,
                      }}
                    >
                      <View className="flex-row items-center mb-1">
                        <Ionicons
                          name={
                            SUPPLEMENT_CATEGORIES.find((c) => c.id === post.category)
                              ?.icon as any
                          }
                          size={16}
                          color={
                            isGuest 
                              ? `rgba(156, 163, 175, ${iconOpacity})` 
                              : SUPPLEMENT_CATEGORIES.find((c) => c.id === post.category)?.color
                          }
                        />
                        <Text 
                          className="font-bold text-lg ml-2"
                          style={{ 
                            color: isGuest ? `rgba(0, 0, 0, ${textOpacity})` : "#000"
                          }}
                        >
                          {post.supplementName}
                        </Text>
                      </View>
                      <Text 
                        className="text-sm"
                        style={{ 
                          color: isGuest ? `rgba(75, 85, 99, ${textOpacity})` : "#4b5563"
                        }}
                      >
                        {post.brand}
                      </Text>
                    </View>
                    <Text 
                      className="text-base leading-6"
                      style={{ 
                        color: isGuest ? `rgba(0, 0, 0, ${textOpacity})` : "#000"
                      }}
                    >
                      {post.review}
                    </Text>
                  </View>

                  {/* Post actions */}
                  <View className="flex-row px-4 py-3 border-t border-gray-100">
                    <Pressable className="flex-row items-center mr-6">
                      <Ionicons 
                        name="heart-outline" 
                        size={24} 
                        color={isGuest ? `rgba(102, 102, 102, ${iconOpacity})` : "#666"}
                      />
                      <Text 
                        className="ml-2"
                        style={{ 
                          color: isGuest ? `rgba(75, 85, 99, ${textOpacity})` : "#4b5563"
                        }}
                      >
                        {post.likes}
                      </Text>
                    </Pressable>
                    <Pressable className="flex-row items-center">
                      <Ionicons 
                        name="chatbubble-outline" 
                        size={22} 
                        color={isGuest ? `rgba(102, 102, 102, ${iconOpacity})` : "#666"}
                      />
                      <Text 
                        className="ml-2"
                        style={{ 
                          color: isGuest ? `rgba(75, 85, 99, ${textOpacity})` : "#4b5563"
                        }}
                      >
                        {post.comments}
                      </Text>
                      {post.hasUnreadComments && !isGuest && (
                        <View className="ml-1 w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </Pressable>
                  </View>
                </Pressable>
              );
            })
          )}
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
              <View>
                <View className="flex-row items-center mb-3">
                  <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                  <Text className="ml-3 text-gray-700">Пълен достъп до социалния feed</Text>
                </View>
                <View className="flex-row items-center mb-3">
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
                (navigation as any).navigate("Registration");
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
