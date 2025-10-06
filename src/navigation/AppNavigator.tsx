import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import FeedScreen from "../screens/FeedScreen";
import ScanScreen from "../screens/ScanScreen";
import DatabaseScreen from "../screens/DatabaseScreen";
import MessagesScreen from "../screens/MessagesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ScanResultScreen from "../screens/ScanResultScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import StacksScreen from "../screens/StacksScreen";
import StackDetailScreen from "../screens/StackDetailScreen";
import PublicStacksFeedScreen from "../screens/PublicStacksFeedScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import { useAppStore } from "../state/appStore";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Mock notification count - should come from state
const NEW_PRODUCTS_COUNT = 2;

function TabNavigator() {
  const getUnreadMessagesCount = useAppStore((s) => s.getUnreadMessagesCount);
  const getUnreadNotificationsCount = useAppStore((s) => s.getUnreadNotificationsCount);
  
  const unreadTotal = getUnreadMessagesCount() + getUnreadNotificationsCount();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: "Новини",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarLabel: "Сканирай",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Database"
        component={DatabaseScreen}
        options={{
          tabBarLabel: "Библиотека",
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <Ionicons name="library" size={size} color={color} />
              {NEW_PRODUCTS_COUNT > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: -6,
                    top: -3,
                    backgroundColor: "#ef4444",
                    borderRadius: 10,
                    minWidth: 18,
                    height: 18,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 4,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
                    {NEW_PRODUCTS_COUNT}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarLabel: "Съобщения",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="chatbubbles" size={size} color={color} />
              {unreadTotal > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: -6,
                    top: -3,
                    backgroundColor: "#ef4444",
                    borderRadius: 10,
                    minWidth: 18,
                    height: 18,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 4,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
                    {unreadTotal}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Профил",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name="ScanResult"
        component={ScanResultScreen}
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          presentation: "card",
          headerShown: true,
          title: "Любими съставки",
        }}
      />
      <Stack.Screen
        name="Stacks"
        component={StacksScreen}
        options={{
          presentation: "card",
          headerShown: true,
          title: "Мои стакове",
        }}
      />
      <Stack.Screen
        name="StackDetail"
        component={StackDetailScreen}
        options={{
          presentation: "card",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PublicStacksFeed"
        component={PublicStacksFeedScreen}
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Registration"
        component={RegistrationScreen}
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          presentation: "card",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
