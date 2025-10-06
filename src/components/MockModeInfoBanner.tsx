import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InfoBannerProps {
  onDismiss?: () => void;
}

export default function MockModeInfoBanner({ onDismiss }: InfoBannerProps) {
  return (
    <View className="bg-amber-50 border border-amber-200 rounded-lg p-4 mx-4 my-2">
      <View className="flex-row items-start">
        <Ionicons name="information-circle" size={24} color="#f59e0b" />
        <View className="flex-1 ml-3">
          <Text className="font-semibold text-amber-900 mb-1">
            Demo режим
          </Text>
          <Text className="text-sm text-amber-800 leading-5">
            Приложението работи с примерни данни. За реален OCR анализ, свържете се с backend сървъра.
          </Text>
        </View>
        {onDismiss && (
          <Pressable onPress={onDismiss} className="ml-2">
            <Ionicons name="close" size={20} color="#f59e0b" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
