import React, { useState, useRef } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAppStore } from "../state/appStore";
import { scanAndAnalyzeSupplement } from "../api/supplement-backend";
import { useNavigation } from "@react-navigation/native";

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  
  const user = useAppStore((s) => s.user);
  const addScan = useAppStore((s) => s.addScan);
  const navigation = useNavigation();

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-black">
        <Ionicons name="camera-outline" size={64} color="#fff" />
        <Text className="text-white text-lg mt-4 text-center px-8">
          Необходимо е разрешение за достъп до камерата
        </Text>
        <Pressable
          onPress={requestPermission}
          className="bg-blue-500 px-6 py-3 rounded-lg mt-6"
        >
          <Text className="text-white font-semibold">Разреши достъп</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      await processImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync();

      if (photo && photo.uri) {
        await processImage(photo.uri);
      }
    } catch (error) {
      console.error("Error taking picture:", error);
    }
  };

  const processImage = async (imageUri: string) => {
    setIsProcessing(true);
    try {
      const analysis = await scanAndAnalyzeSupplement(imageUri);
      
      const scanRecord = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUri,
        analysis,
        score: Math.floor(Math.random() * 30) + 70, // Mock score 70-100
      };

      addScan(scanRecord);

      // Navigate to result screen
      (navigation as any).navigate("ScanResult", { scanRecord });
    } catch (error: any) {
      console.error("Processing error:", error);
      let errorMessage = "Грешка при обработка на изображението.";
      
      if (error?.message?.includes("Network request failed")) {
        errorMessage = "Не може да се свърже със сървъра. Проверете интернет връзката.";
      } else if (error?.message?.includes("OCR failed")) {
        errorMessage = "Не може да се разпознае текст от изображението. Опитайте отново с по-ясна снимка.";
      } else if (error?.message?.includes("AI analysis failed")) {
        errorMessage = "AI анализът е неуспешен. Моля опитайте отново.";
      }
      
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
      >
        {/* Overlay UI */}
        <View className="absolute top-0 left-0 right-0 bottom-0 z-10">
          <SafeAreaView className="flex-1" edges={["top"]}>
            {/* Top bar */}
            <View className="px-4 py-3">
              <View className="flex-row items-center justify-between">
                <View className="bg-black/50 px-3 py-2 rounded-lg">
                  <Text className="text-white font-semibold">
                    {user.tier === "guest" ? "Гост" : user.tier === "free" ? "Free" : "Premium"}
                  </Text>
                </View>
                <Pressable
                  onPress={toggleCameraFacing}
                  className="bg-black/50 w-12 h-12 rounded-full items-center justify-center"
                >
                  <Ionicons name="camera-reverse" size={24} color="white" />
                </Pressable>
              </View>
            </View>

            {/* Center guide */}
            <View className="flex-1 items-center justify-center px-8">
              <View className="border-2 border-white rounded-lg w-full aspect-[3/4] opacity-60" />
              <Text className="text-white text-center mt-4 text-lg">
                Центрирайте етикета в рамката
              </Text>
            </View>

            {/* Bottom controls */}
            <View className="pb-8 items-center">
              <View className="flex-row items-center justify-around w-full px-12">
                <Pressable
                  onPress={pickImageFromGallery}
                  className="bg-black/50 w-14 h-14 rounded-full items-center justify-center"
                >
                  <Ionicons name="images" size={28} color="white" />
                </Pressable>

                <Pressable
                  onPress={takePicture}
                  disabled={isProcessing}
                  className="bg-white w-20 h-20 rounded-full items-center justify-center border-4 border-gray-300"
                >
                  {isProcessing ? (
                    <ActivityIndicator size="large" color="#3b82f6" />
                  ) : (
                    <View className="bg-blue-500 w-16 h-16 rounded-full" />
                  )}
                </Pressable>

                <View className="w-14" />
              </View>
            </View>
          </SafeAreaView>
        </View>
      </CameraView>
    </View>
  );
}
