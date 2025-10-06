import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../state/appStore";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { moderateBio, ModerationResult } from "../api/moderation";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const user = useAppStore((s) => s.user);
  
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [profilePhotoUri, setProfilePhotoUri] = useState(user.profilePhotoUri);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert("Разрешение отказано", "Моля разрешете достъп до галерията");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert("Разрешение отказано", "Моля разрешете достъп до камерата");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePhotoUri(result.assets[0].uri);
    }
  };

  const handlePhotoOptions = () => {
    Alert.alert(
      "Профилна снимка",
      "Изберете източник",
      [
        { text: "Направи снимка", onPress: takePhoto },
        { text: "Избери от галерия", onPress: pickImage },
        { text: "Отказ", style: "cancel" },
      ]
    );
  };

  const saveProfile = async () => {
    setIsLoading(true);

    try {
      // Moderate bio if changed
      let bioModeration: ModerationResult | undefined;
      if (bio.trim() !== user.bio && bio.trim().length > 0) {
        bioModeration = await moderateBio(bio.trim());
        
        if (bioModeration.status === "rejected") {
          Alert.alert(
            "Биографията не може да бъде запазена",
            `Причина: ${bioModeration.reason}\n\nМоля редактирайте съдържанието.`
          );
          setIsLoading(false);
          return;
        }
        
        if (bioModeration.status === "flagged") {
          Alert.alert(
            "Биографията е отбелязана за проверка",
            "Вашата биография ще бъде прегледана от модератор преди да стане видима.",
            [
              {
                text: "OK",
                onPress: () => proceedWithSave(bioModeration),
              },
            ]
          );
          return;
        }
      }

      await proceedWithSave(bioModeration);
    } catch (error) {
      Alert.alert("Грешка", "Не успяхме да запазим промените");
      setIsLoading(false);
    }
  };

  const proceedWithSave = async (bioModeration?: ModerationResult) => {
    const currentUser = useAppStore.getState().user;
    
    useAppStore.setState({
      user: {
        ...currentUser,
        name: name.trim(),
        bio: bio.trim() || undefined,
        profilePhotoUri: profilePhotoUri,
        profileCard: {
          ...currentUser.profileCard,
          name: name.trim(),
          bio: bio.trim() || undefined,
        },
      },
    });

    setIsLoading(false);
    Alert.alert("Успех", "Профилът е обновен успешно", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text className="text-xl font-bold">Редактирай профил</Text>
        <Pressable
          onPress={saveProfile}
          disabled={isLoading || name.trim().length < 2}
        >
          <Text
            className={`font-semibold text-lg ${
              isLoading || name.trim().length < 2 ? "text-gray-400" : "text-blue-500"
            }`}
          >
            {isLoading ? "Запис..." : "Готово"}
          </Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1">
        {/* Profile photo */}
        <View className="items-center py-8 border-b border-gray-200">
          <Pressable onPress={handlePhotoOptions} className="relative">
            {profilePhotoUri ? (
              <Image
                source={{ uri: profilePhotoUri }}
                className="w-28 h-28 rounded-full"
              />
            ) : (
              <View className="w-28 h-28 rounded-full bg-blue-500 items-center justify-center">
                <Text className="text-white text-5xl font-bold">
                  {name[0]?.toUpperCase() || "?"}
                </Text>
              </View>
            )}
            <View className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-blue-500 border-4 border-white items-center justify-center">
              <Ionicons name="camera" size={20} color="white" />
            </View>
          </Pressable>
          <Text className="text-sm text-gray-600 mt-3">
            Натиснете за промяна на снимката
          </Text>
        </View>

        {/* Form */}
        <View className="p-4">
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Име
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Вашето име"
              placeholderTextColor="#999"
              maxLength={30}
              className="bg-gray-100 rounded-lg px-4 py-3 text-base"
            />
            <Text className="text-xs text-gray-500 mt-1">
              Това име ще виждат другите потребители
            </Text>
          </View>

          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-semibold text-gray-700">
                Биография
              </Text>
              <Text className="text-xs text-gray-500">
                {bio.length}/200
              </Text>
            </View>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Разкажете нещо за себе си..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              maxLength={200}
              className="bg-gray-100 rounded-lg px-4 py-3 text-base"
              style={{ textAlignVertical: "top" }}
            />
            <Text className="text-xs text-gray-500 mt-1">
              Вашата биография ще бъде модерирана автоматично преди публикуване
            </Text>
          </View>

          {/* Account info (read-only) */}
          <View className="bg-gray-50 rounded-lg p-4">
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              Информация за акаунта
            </Text>
            
            {user.phoneNumber && (
              <View className="flex-row items-center mb-2">
                <Ionicons name="phone-portrait" size={20} color="#666" />
                <Text className="ml-2 text-gray-700">
                  {user.phoneNumber}
                </Text>
                {user.isPhoneVerified && (
                  <Ionicons name="checkmark-circle" size={18} color="#22c55e" className="ml-2" />
                )}
              </View>
            )}

            {user.email && (
              <View className="flex-row items-center">
                <Ionicons name="mail" size={20} color="#666" />
                <Text className="ml-2 text-gray-700">
                  {user.email}
                </Text>
                {user.isEmailVerified && (
                  <Ionicons name="checkmark-circle" size={18} color="#22c55e" className="ml-2" />
                )}
              </View>
            )}
          </View>

          <View className="mt-6 bg-blue-50 rounded-lg p-4">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#3b82f6" />
              <View className="flex-1 ml-2">
                <Text className="text-sm text-blue-900 leading-5">
                  Телефонният номер и имейл адресът остават скрити. 
                  Те се използват само за верификация и сигурност.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
