import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore, SupplementCategory } from "../state/appStore";
import { useNavigation } from "@react-navigation/native";
import { SUPPLEMENT_CATEGORIES } from "../utils/categories";
import * as ImagePicker from 'expo-image-picker';

interface FeedPost {
  id: string;
  username: string;
  userId: string;
  timestamp: number;
  supplementName: string;
  brand: string;
  review: string;
  likes: string[]; // array of userIds who liked
  comments: FeedComment[];
  rating: number;
  category: SupplementCategory;
  hasUnreadComments?: boolean;
}

interface FeedComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  imageUri?: string;
  timestamp: number;
}

export default function FeedScreen() {
  const navigation = useNavigation();
  const user = useAppStore((s) => s.user);
  const getUnreadMessagesCount = useAppStore((s) => s.getUnreadMessagesCount);
  const getUnreadNotificationsCount = useAppStore((s) => s.getUnreadNotificationsCount);
  const [selectedCategory, setSelectedCategory] = useState<SupplementCategory | "all" | "stacks">("all");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentImage, setCommentImage] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const isGuest = user.tier === "guest";
  const unreadTotal = getUnreadMessagesCount() + getUnreadNotificationsCount();

  // Mock social posts with categories
  const [mockPosts, setMockPosts] = useState<FeedPost[]>([
    {
      id: "1",
      username: "Иван Петров",
      userId: "user1",
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      supplementName: "BCAA 2:1:1",
      brand: "Optimum Nutrition",
      review: "Отличен продукт! Забелязвам по-бърз възстановяване след тренировка.",
      likes: ["user5", "user6"],
      comments: [],
      rating: 4.5,
      category: "proteins",
      hasUnreadComments: true,
    },
    {
      id: "2",
      username: "Мария Георгиева",
      userId: "user2",
      timestamp: Date.now() - 5 * 60 * 60 * 1000,
      supplementName: "Omega-3 Fish Oil",
      brand: "Nordic Naturals",
      review: "Препоръчвам! Високо качество и без неприятен вкус.",
      likes: ["user3", "user4", "user5"],
      comments: [],
      rating: 5.0,
      category: "probiotics",
    },
    {
      id: "3",
      username: "Георги Иванов",
      userId: "user3",
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
      supplementName: "Creatine Monohydrate",
      brand: "MyProtein",
      review: "Чиста креатин на страхотна цена. Резултатите са видими след 2 седмици.",
      likes: ["user2", "user4", "user5", "user6"],
      comments: [],
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
      likes: ["user1", "user2"],
      comments: [],
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
      likes: ["user1", "user3", "user6"],
      comments: [],
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
      likes: ["user2", "user5"],
      comments: [],
      rating: 4.3,
      category: "multi",
      hasUnreadComments: true,
    },
  ]);

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
        {/* Messages icon */}
        <Pressable
          onPress={() => {
            if (isGuest) {
              setShowRegistrationModal(true);
            } else {
              (navigation as any).navigate("Messages");
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

        {/* Stacks tab */}
        <Pressable
          onPress={() => setSelectedCategory("stacks")}
          className="mr-2"
        >
          <View
            className="px-4 py-2 rounded-full flex-row items-center"
            style={{
              backgroundColor: selectedCategory === "stacks" ? "#f59e0b" : "#fef3c7",
            }}
          >
            <Ionicons
              name="layers"
              size={16}
              color={selectedCategory === "stacks" ? "#fff" : "#f59e0b"}
            />
            <Text
              className="ml-2 font-semibold"
              style={{ color: selectedCategory === "stacks" ? "#fff" : "#f59e0b" }}
            >
              Стакове
            </Text>
          </View>
        </Pressable>
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
                    <Pressable 
                      className="flex-row items-center mr-6"
                      onPress={() => {
                        if (isGuest) {
                          setShowRegistrationModal(true);
                          return;
                        }
                        setMockPosts(prev => prev.map(p => {
                          if (p.id === post.id) {
                            const hasLiked = p.likes.includes(user.id);
                            return {
                              ...p,
                              likes: hasLiked 
                                ? p.likes.filter(id => id !== user.id)
                                : [...p.likes, user.id]
                            };
                          }
                          return p;
                        }));
                      }}
                    >
                      <Ionicons 
                        name={post.likes.includes(user.id) ? "heart" : "heart-outline"}
                        size={24} 
                        color={post.likes.includes(user.id) ? "#ef4444" : (isGuest ? `rgba(102, 102, 102, ${iconOpacity})` : "#666")}
                      />
                      <Text 
                        className="ml-2"
                        style={{ 
                          color: isGuest ? `rgba(75, 85, 99, ${textOpacity})` : "#4b5563"
                        }}
                      >
                        {post.likes.length}
                      </Text>
                    </Pressable>
                    <Pressable 
                      className="flex-row items-center"
                      onPress={() => {
                        if (isGuest) {
                          setShowRegistrationModal(true);
                          return;
                        }
                        setSelectedPost(post);
                      }}
                    >
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
                        {post.comments.length}
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

      {/* Comments Modal */}
      {selectedPost && (
        <Modal visible={!!selectedPost} transparent animationType="slide">
          <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView 
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="flex-1"
            >
              {/* Header */}
              <View className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
                <Text className="text-lg font-semibold">Коментари</Text>
                <Pressable onPress={() => {
                  setSelectedPost(null);
                  setCommentText("");
                  setCommentImage(null);
                }}>
                  <Ionicons name="close" size={28} color="#666" />
                </Pressable>
              </View>

              {/* Comments list */}
              <ScrollView className="flex-1 px-4 py-4">
                {selectedPost.comments.length === 0 ? (
                  <View className="items-center py-16">
                    <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
                    <Text className="text-gray-400 mt-4">Все още няма коментари</Text>
                    <Text className="text-gray-400 text-sm mt-2">Бъдете първите!</Text>
                  </View>
                ) : (
                  selectedPost.comments.map((comment) => (
                    <View key={comment.id} className="mb-4">
                      <View className="flex-row items-start">
                        <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
                          <Text className="text-white font-bold">{comment.userName[0]}</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="font-semibold">{comment.userName}</Text>
                          <Text className="text-gray-700 mt-1">{comment.content}</Text>
                          {comment.imageUri && (
                            <View className="mt-2 bg-gray-100 rounded-lg p-2">
                              <Text className="text-xs text-gray-500">📷 Снимка прикачена</Text>
                            </View>
                          )}
                          <Text className="text-xs text-gray-400 mt-1">
                            {new Date(comment.timestamp).toLocaleString("bg-BG")}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </ScrollView>

              {/* Comment input */}
              <View className="px-4 py-3 border-t border-gray-200">
                {commentImage && (
                  <View className="mb-2 bg-blue-50 rounded-lg p-3 flex-row items-center justify-between">
                    <Text className="text-sm text-blue-700">📷 Снимка избрана</Text>
                    <Pressable onPress={() => setCommentImage(null)}>
                      <Ionicons name="close-circle" size={20} color="#3b82f6" />
                    </Pressable>
                  </View>
                )}
                
                <View className="flex-row items-end">
                  <Pressable
                    onPress={async () => {
                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        quality: 0.8,
                      });
                      if (!result.canceled) {
                        setCommentImage(result.assets[0].uri);
                      }
                    }}
                    className="w-10 h-10 items-center justify-center mr-2"
                  >
                    <Ionicons name="image-outline" size={24} color="#3b82f6" />
                  </Pressable>
                  
                  <TextInput
                    value={commentText}
                    onChangeText={setCommentText}
                    placeholder="Напишете коментар..."
                    placeholderTextColor="#999"
                    multiline
                    className="flex-1 bg-gray-100 rounded-full px-4 py-3 mr-2 max-h-24"
                    style={{ fontSize: 16 }}
                  />
                  
                  <Pressable
                    onPress={() => {
                      if (commentText.trim()) {
                        const newComment: FeedComment = {
                          id: Date.now().toString(),
                          userId: user.id,
                          userName: user.name,
                          content: commentText,
                          imageUri: commentImage || undefined,
                          timestamp: Date.now(),
                        };
                        
                        setMockPosts(prev => prev.map(p => {
                          if (p.id === selectedPost.id) {
                            return {
                              ...p,
                              comments: [...p.comments, newComment]
                            };
                          }
                          return p;
                        }));
                        
                        setCommentText("");
                        setCommentImage(null);
                        setSelectedPost({
                          ...selectedPost,
                          comments: [...selectedPost.comments, newComment]
                        });
                      }
                    }}
                    className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center"
                    disabled={!commentText.trim()}
                    style={{ opacity: commentText.trim() ? 1 : 0.5 }}
                  >
                    <Ionicons name="send" size={20} color="#fff" />
                  </Pressable>
                </View>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
}
