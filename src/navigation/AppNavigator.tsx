import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import FeedScreen from "../screens/FeedScreen";
import ScanScreen from "../screens/ScanScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import StacksScreen from "../screens/StacksScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ScanResultScreen from "../screens/ScanResultScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
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
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: "Любими",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
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
        name="Stacks"
        component={StacksScreen}
        options={{
          tabBarLabel: "Стакове",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="layers" size={size} color={color} />
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
    </Stack.Navigator>
  );
}
