import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../state/appStore";
import { useNavigation, useRoute } from "@react-navigation/native";
import { moderateComment, isContentApproved } from "../api/moderation";

export default function StackDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { stackId } = route.params as { stackId: string };

  const user = useAppStore((s) => s.user);
  const stacks = useAppStore((s) => s.stacks);
  const likeStack = useAppStore((s) => s.likeStack);
  const unlikeStack = useAppStore((s) => s.unlikeStack);
  const addStackComment = useAppStore((s) => s.addStackComment);
  const followStack = useAppStore((s) => s.followStack);
  const unfollowStack = useAppStore((s) => s.unfollowStack);
  const followUser = useAppStore((s) => s.followUser);
  const unfollowUser = useAppStore((s) => s.unfollowUser);
  const isFollowingUser = useAppStore((s) => s.isFollowingUser);
  const toggleStackPublic = useAppStore((s) => s.toggleStackPublic);

  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const stack = stacks.find((s) => s.id === stackId);

  if (!stack) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400">Stack не е намерен</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isOwnStack = stack.createdBy === user.id;
  const hasLiked = stack.likes.includes(user.id);
  const isFollowingStack = stack.followers.includes(user.id);
  const isFollowingCreator = isFollowingUser(stack.createdBy);

  const handleLike = () => {
    if (hasLiked) {
      unlikeStack(stackId);
    } else {
      likeStack(stackId);
    }
  };

  const handleFollowStack = () => {
    if (isFollowingStack) {
      unfollowStack(stackId);
    } else {
      followStack(stackId);
    }
  };

  const handleFollowCreator = () => {
    if (isFollowingCreator) {
      unfollowUser(stack.createdBy);
    } else {
      followUser(stack.createdBy);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    setIsSubmittingComment(true);

    try {
      // AI Moderation
      const moderation = await moderateComment(commentText.trim());
      
      if (moderation.status === "rejected") {
        Alert.alert(
          "Коментарът не може да бъде публикуван",
          `Причина: ${moderation.reason}\n\nМоля редактирайте съдържанието.`
        );
        setIsSubmittingComment(false);
        return;
      }

      const comment = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        content: commentText.trim(),
        timestamp: Date.now(),
        moderation,
      };

      // Add comment to stack
      const currentStack = useAppStore.getState().stacks.find(s => s.id === stackId);
      if (currentStack) {
        useAppStore.getState().updateStack(stackId, {
          comments: [...currentStack.comments, comment],
        });
      }

      setCommentText("");
      Keyboard.dismiss();
      
      if (moderation.status === "flagged") {
        Alert.alert(
          "Коментар добавен",
          "Вашият коментар е отбелязан за проверка и ще бъде прегледан от модератор."
        );
      }
    } catch (error) {
      Alert.alert("Грешка", "Не успяхме да добавим коментара.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleTogglePublic = () => {
    toggleStackPublic(stackId);
  };

  const displayComments = showAllComments ? stack.comments : stack.comments.slice(0, 3);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
        <Pressable onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text className="text-xl font-bold flex-1">{stack.name}</Text>
        {isOwnStack && (
          <Pressable onPress={handleTogglePublic}>
            <Ionicons
              name={stack.isPublic ? "eye" : "eye-off"}
              size={24}
              color={stack.isPublic ? "#3b82f6" : "#666"}
            />
          </Pressable>
        )}
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <ScrollView className="flex-1">
          {/* Creator info */}
          <View className="px-4 py-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 rounded-full bg-amber-500 items-center justify-center mr-3">
                  <Text className="text-white font-bold text-lg">
                    {stack.createdByName[0]}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-base">{stack.createdByName}</Text>
                  <Text className="text-xs text-gray-500">
                    Създаден {new Date(stack.createdAt).toLocaleDateString("bg-BG")}
                  </Text>
                </View>
              </View>
              {!isOwnStack && (
                <Pressable
                  onPress={handleFollowCreator}
                  className={`px-4 py-2 rounded-lg ${
                    isFollowingCreator ? "bg-gray-200" : "bg-blue-500"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      isFollowingCreator ? "text-gray-700" : "text-white"
                    }`}
                  >
                    {isFollowingCreator ? "Следвате" : "Следвай"}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Stack info */}
          <View className="px-4 py-4 border-b border-gray-100">
            <View className="flex-row items-center mb-3">
              <Ionicons
                name={stack.isPublic ? "globe" : "lock-closed"}
                size={16}
                color="#666"
              />
              <Text className="text-sm text-gray-600 ml-2">
                {stack.isPublic ? "Публичен stack" : "Частен stack"}
              </Text>
            </View>

            {stack.description && (
              <Text className="text-base leading-6 mb-4">{stack.description}</Text>
            )}

            {/* AI Analysis */}
            {stack.aiAnalysis && (
              <View className="bg-gray-50 rounded-xl p-4 mb-4">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="font-semibold">AI Анализ</Text>
                  <View className="flex-row items-center">
                    <View
                      className={`w-3 h-3 rounded-full mr-2 ${
                        stack.aiAnalysis.compatibility >= 80
                          ? "bg-green-500"
                          : stack.aiAnalysis.compatibility >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <Text className="font-bold text-lg">
                      {stack.aiAnalysis.compatibility}%
                    </Text>
                  </View>
                </View>

                {stack.aiAnalysis.warnings.length > 0 && (
                  <View className="mb-3">
                    <Text className="text-sm font-semibold text-red-600 mb-1">
                      Предупреждения:
                    </Text>
                    {stack.aiAnalysis.warnings.map((warning, idx) => (
                      <Text key={idx} className="text-sm text-gray-700 ml-2">
                        • {warning}
                      </Text>
                    ))}
                  </View>
                )}

                {stack.aiAnalysis.recommendations.length > 0 && (
                  <View>
                    <Text className="text-sm font-semibold text-green-600 mb-1">
                      Препоръки:
                    </Text>
                    {stack.aiAnalysis.recommendations.map((rec, idx) => (
                      <Text key={idx} className="text-sm text-gray-700 ml-2">
                        • {rec}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Supplements list */}
            <View className="mb-3">
              <Text className="font-semibold mb-2">
                Съставки ({stack.supplements.length})
              </Text>
              {stack.supplements.map((supp, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center bg-gray-50 rounded-lg p-3 mb-2"
                >
                  <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center mr-3">
                    <Text className="text-xs font-semibold text-amber-700">
                      {idx + 1}
                    </Text>
                  </View>
                  <Text className="text-base flex-1">{supp}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Social actions */}
          <View className="px-4 py-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Pressable
                  onPress={handleLike}
                  className="flex-row items-center mr-6"
                >
                  <Ionicons
                    name={hasLiked ? "heart" : "heart-outline"}
                    size={28}
                    color={hasLiked ? "#ef4444" : "#666"}
                  />
                  <Text className="ml-2 text-gray-700 font-semibold">
                    {stack.likes.length}
                  </Text>
                </Pressable>

                <View className="flex-row items-center mr-6">
                  <Ionicons name="chatbubble-outline" size={26} color="#666" />
                  <Text className="ml-2 text-gray-700 font-semibold">
                    {stack.comments.length}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="eye-outline" size={28} color="#666" />
                  <Text className="ml-2 text-gray-700 font-semibold">
                    {stack.followers.length}
                  </Text>
                </View>
              </View>

              {!isOwnStack && (
                <Pressable
                  onPress={handleFollowStack}
                  className={`px-4 py-2 rounded-lg flex-row items-center ${
                    isFollowingStack ? "bg-gray-200" : "bg-amber-500"
                  }`}
                >
                  <Ionicons
                    name={isFollowingStack ? "notifications" : "notifications-outline"}
                    size={18}
                    color={isFollowingStack ? "#666" : "#fff"}
                  />
                  <Text
                    className={`ml-2 font-semibold ${
                      isFollowingStack ? "text-gray-700" : "text-white"
                    }`}
                  >
                    {isFollowingStack ? "Следите" : "Следи"}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Comments section */}
          <View className="px-4 py-4">
            <Text className="font-semibold text-lg mb-4">
              Коментари ({stack.comments.length})
            </Text>

            {stack.comments.length === 0 ? (
              <View className="items-center py-8">
                <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
                <Text className="text-gray-400 mt-2">Все още няма коментари</Text>
              </View>
            ) : (
              <>
                {displayComments.map((comment) => {
                  // Only show approved comments
                  if (!isContentApproved(comment.moderation)) {
                    return null;
                  }

                  return (
                    <View key={comment.id} className="mb-4">
                      <View className="flex-row items-start">
                        <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center mr-3">
                          <Text className="text-white font-semibold text-xs">
                            {comment.userName[0]}
                          </Text>
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center mb-1">
                            <Text className="font-semibold text-sm mr-2">
                              {comment.userName}
                            </Text>
                            <Text className="text-xs text-gray-400">
                              {new Date(comment.timestamp).toLocaleDateString("bg-BG")}
                            </Text>
                          </View>
                          <Text className="text-gray-700 leading-5">
                            {comment.content}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}

                {stack.comments.length > 3 && !showAllComments && (
                  <Pressable
                    onPress={() => setShowAllComments(true)}
                    className="py-2"
                  >
                    <Text className="text-blue-500 font-semibold">
                      Покажи още {stack.comments.length - 3} коментара
                    </Text>
                  </Pressable>
                )}
              </>
            )}
          </View>
        </ScrollView>

        {/* Comment input */}
        <TouchableWithoutFeedback>
          <View className="border-t border-gray-200 px-4 py-3 bg-white">
            <View className="flex-row items-center">
              <View className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-3">
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Добави коментар..."
                  placeholderTextColor="#999"
                  multiline
                  maxLength={500}
                  className="text-base max-h-24"
                  returnKeyType="send"
                  onSubmitEditing={handleAddComment}
                />
              </View>
              <Pressable
                onPress={handleAddComment}
                disabled={!commentText.trim() || isSubmittingComment}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  commentText.trim() && !isSubmittingComment ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <Ionicons
                  name={isSubmittingComment ? "hourglass" : "send"}
                  size={20}
                  color={commentText.trim() && !isSubmittingComment ? "#fff" : "#999"}
                />
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
