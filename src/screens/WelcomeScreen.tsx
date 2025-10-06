import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: "scan" as const,
      color: "#3b82f6",
      title: "Сканирайте добавки",
      description: "Снимайте етикети с камерата и получавайте AI анализ на съставките",
    },
    {
      icon: "star" as const,
      color: "#f59e0b",
      title: "Оценки и анализи",
      description: "Виждайте детайлни оценки и експертни анализи на всеки продукт",
    },
    {
      icon: "people" as const,
      color: "#22c55e",
      title: "Социална общност",
      description: "Споделяйте опит, четете отзиви и общувайте с хора като вас",
    },
    {
      icon: "layers" as const,
      color: "#8b5cf6",
      title: "Създавайте стакове",
      description: "Комбинирайте добавки и проверявайте съвместимостта с AI",
    },
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        {/* Skip button */}
        <View className="flex-row justify-end py-4">
          <Pressable onPress={handleSkip}>
            <Text className="text-gray-500 font-semibold">Пропусни</Text>
          </Pressable>
        </View>

        {/* Content */}
        <View className="flex-1 items-center justify-center">
          <Animated.View
            key={currentStep}
            entering={FadeIn.duration(300)}
            className="items-center"
          >
            <View
              className="w-32 h-32 rounded-full items-center justify-center mb-8"
              style={{ backgroundColor: currentStepData.color + "20" }}
            >
              <Ionicons
                name={currentStepData.icon}
                size={64}
                color={currentStepData.color}
              />
            </View>

            <Text className="text-3xl font-bold text-center mb-4">
              {currentStepData.title}
            </Text>

            <Text className="text-base text-gray-600 text-center leading-6 px-4">
              {currentStepData.description}
            </Text>
          </Animated.View>
        </View>

        {/* Bottom section */}
        <View className="pb-8">
          {/* Pagination dots */}
          <View className="flex-row justify-center mb-8">
            {steps.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full mx-1 ${
                  index === currentStep
                    ? "w-8 bg-blue-500"
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </View>

          {/* Next button */}
          <Pressable
            onPress={handleNext}
            className="bg-blue-500 py-4 rounded-xl"
          >
            <Text className="text-white font-bold text-lg text-center">
              {currentStep < steps.length - 1 ? "Напред" : "Започнете"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
