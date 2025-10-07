import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../state/appStore";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const TopTab = createMaterialTopTabNavigator();

function MessagesTab() {
  const messages = useAppStore((s) => s.messages);
  const markMessageAsRead = useAppStore((s) => s.markMessageAsRead);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Group messages by conversation
  const conversations = messages.reduce((acc: any, msg) => {
    const otherId = msg.fromUserId;
    if (!acc[otherId]) {
      acc[otherId] = [];
    }
    acc[otherId].push(msg);
    return acc;
  }, {});

  // Get conversation messages
  const getConversationMessages = (userId: string) => {
    return conversations[userId] || [];
  };

  const handleOpenConversation = (userId: string) => {
    setSelectedConversation(userId);
    // Mark all messages in this conversation as read
    const conversationMsgs = getConversationMessages(userId);
    conversationMsgs.forEach((msg: any) => {
      if (!msg.read) {
        markMessageAsRead(msg.id);
      }
    });
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      // In a real app, this would send the message to the backend
      // For now, we'll just show a success state
      setReplyText("");
      // Close modal after a short delay to show the message was "sent"
      setTimeout(() => {
        setSelectedConversation(null);
      }, 300);
    }
  };

  if (messages.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-8 bg-white">
        <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
        <Text className="text-gray-400 text-lg mt-4 text-center">
          Няма съобщения
        </Text>
        <Text className="text-gray-400 text-sm mt-2 text-center">
          Съобщенията от приятели ще се показват тук
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView className="flex-1 bg-white">
        {Object.entries(conversations).map(([userId, msgs]: [string, any]) => {
          const lastMsg = msgs[0];
          return (
            <Pressable
              key={userId}
              onPress={() => handleOpenConversation(userId)}
              className="px-4 py-4 border-b border-gray-200 flex-row items-center"
            >
              <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold text-lg">
                  {lastMsg.fromUserName[0]}
                </Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="font-semibold text-base">{lastMsg.fromUserName}</Text>
                  {!lastMsg.read && (
                    <View className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </View>
                <Text className="text-gray-600 text-sm" numberOfLines={1}>
                  {lastMsg.type === "supplement_share"
                    ? "📦 Споделена добавка"
                    : lastMsg.type === "stack_share"
                    ? "📚 Споделен stack"
                    : lastMsg.content}
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  {new Date(lastMsg.timestamp).toLocaleDateString("bg-BG")}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Conversation Modal */}
      {selectedConversation && (
        <Modal visible={!!selectedConversation} transparent animationType="slide">
          <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="flex-1"
              keyboardVerticalOffset={0}
            >
              {/* Header */}
              <View className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
                    <Text className="text-white font-bold">
                      {getConversationMessages(selectedConversation)[0]?.fromUserName[0]}
                    </Text>
                  </View>
                  <Text className="text-lg font-semibold">
                    {getConversationMessages(selectedConversation)[0]?.fromUserName}
                  </Text>
                </View>
                <Pressable onPress={() => setSelectedConversation(null)}>
                  <Ionicons name="close" size={28} color="#666" />
                </Pressable>
              </View>

              {/* Messages */}
              <ScrollView className="flex-1 px-4 py-4">
                {getConversationMessages(selectedConversation)
                  .slice()
                  .reverse()
                  .map((msg: any) => (
                    <View key={msg.id} className="mb-4">
                      <View className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 self-start max-w-[80%]">
                        <Text className="text-base">{msg.content}</Text>
                      </View>
                      <Text className="text-xs text-gray-400 mt-1 ml-2">
                        {new Date(msg.timestamp).toLocaleTimeString("bg-BG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                  ))}
              </ScrollView>

              {/* Reply Input */}
              <View className="px-4 py-3 border-t border-gray-200 flex-row items-end">
                <TextInput
                  value={replyText}
                  onChangeText={setReplyText}
                  placeholder="Напишете съобщение..."
                  placeholderTextColor="#999"
                  multiline
                  className="flex-1 bg-gray-100 rounded-full px-4 py-3 mr-2 max-h-24"
                  style={{ fontSize: 16 }}
                />
                <Pressable
                  onPress={handleSendReply}
                  className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center"
                  disabled={!replyText.trim()}
                  style={{
                    opacity: replyText.trim() ? 1 : 0.5,
                  }}
                >
                  <Ionicons name="send" size={20} color="#fff" />
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
      )}
    </>
  );
}

function NotificationsTab() {
  const notifications = useAppStore((s) => s.notifications);
  const markNotificationAsRead = useAppStore((s) => s.markNotificationAsRead);
  const acceptFriendRequest = useAppStore((s) => s.acceptFriendRequest);

  if (notifications.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-8 bg-white">
        <Ionicons name="notifications-outline" size={64} color="#ccc" />
        <Text className="text-gray-400 text-lg mt-4 text-center">
          Няма нотификации
        </Text>
        <Text className="text-gray-400 text-sm mt-2 text-center">
          Нотификациите за действия ще се показват тук
        </Text>
      </View>
    );
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "friend_request":
        return { name: "person-add" as const, color: "#3b82f6" };
      case "friend_accept":
        return { name: "checkmark-circle" as const, color: "#22c55e" };
      case "like":
        return { name: "heart" as const, color: "#ef4444" };
      case "comment":
        return { name: "chatbubble" as const, color: "#f59e0b" };
      case "share":
        return { name: "share-social" as const, color: "#8b5cf6" };
      case "new_product":
        return { name: "sparkles" as const, color: "#3b82f6" };
      default:
        return { name: "notifications" as const, color: "#666" };
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {notifications.map((notif) => {
        const icon = getNotificationIcon(notif.type);
        return (
          <Pressable
            key={notif.id}
            onPress={() => markNotificationAsRead(notif.id)}
            className={`px-4 py-4 border-b border-gray-200 ${
              !notif.read ? "bg-blue-50" : ""
            }`}
          >
            <View className="flex-row items-start">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: icon.color + "20" }}
              >
                <Ionicons name={icon.name} size={20} color={icon.color} />
              </View>
              <View className="flex-1">
                <Text className="text-base leading-6 mb-1">{notif.message}</Text>
                <Text className="text-gray-400 text-xs">
                  {new Date(notif.timestamp).toLocaleDateString("bg-BG")}
                </Text>
                {notif.type === "friend_request" && notif.actionData && (
                  <View className="flex-row mt-3">
                    <Pressable
                      onPress={() => acceptFriendRequest(notif.actionData.friendId)}
                      className="bg-blue-500 px-4 py-2 rounded-lg mr-2"
                    >
                      <Text className="text-white font-semibold text-sm">Приеми</Text>
                    </Pressable>
                    <Pressable className="bg-gray-200 px-4 py-2 rounded-lg">
                      <Text className="text-gray-700 font-semibold text-sm">Откажи</Text>
                    </Pressable>
                  </View>
                )}
              </View>
              {!notif.read && (
                <View className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
              )}
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export default function MessagesScreen() {
  const canSendMessages = useAppStore((s) => s.canSendMessages);

  if (!canSendMessages()) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
        <View className="px-4 py-3 border-b border-gray-200 bg-white" style={{ paddingTop: 50 }}>
          <Text className="text-2xl font-bold">Съобщения</Text>
        </View>

        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-green-100 w-24 h-24 rounded-full items-center justify-center mb-6">
            <Ionicons name="chatbubbles" size={48} color="#22c55e" />
          </View>
          <Text className="text-3xl font-bold text-center mb-3">
            Съобщения и нотификации
          </Text>
          <Text className="text-center text-gray-600 text-base leading-6 mb-8">
            Регистрирайте се безплатно за да получавате съобщения от приятели и нотификации
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
      <View className="px-4 py-3 border-b border-gray-200 bg-white" style={{ paddingTop: 50 }}>
        <Text className="text-2xl font-bold">Съобщения</Text>
      </View>

      <TopTab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#8E8E93",
          tabBarIndicatorStyle: { backgroundColor: "#007AFF" },
          tabBarLabelStyle: { fontWeight: "600", textTransform: "none" },
        }}
      >
        <TopTab.Screen name="MessagesTab" component={MessagesTab} options={{ title: "Съобщения" }} />
        <TopTab.Screen
          name="NotificationsTab"
          component={NotificationsTab}
          options={{ title: "Нотификации" }}
        />
      </TopTab.Navigator>
    </SafeAreaView>
  );
}
