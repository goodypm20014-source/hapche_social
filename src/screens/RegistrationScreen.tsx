import React, { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../state/appStore";
import { useNavigation } from "@react-navigation/native";

type RegistrationStep = "phone" | "sms_code" | "email" | "email_verify" | "complete";

export default function RegistrationScreen() {
  const navigation = useNavigation();
  const registerUser = useAppStore((s) => s.registerUser);

  const [step, setStep] = useState<RegistrationStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock SMS sending (in production, use real SMS service like Twilio)
  const sendSMSCode = async () => {
    setIsLoading(true);
    
    // Validate phone
    if (phoneNumber.length < 10) {
      Alert.alert("Грешка", "Моля въведете валиден телефонен номер");
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Integrate with real SMS service
      // await fetch('YOUR_SMS_SERVICE_API', {
      //   method: 'POST',
      //   body: JSON.stringify({ phone: phoneNumber })
      // });
      
      console.log(`Sending SMS code to: ${phoneNumber}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        "Код изпратен",
        "Проверете вашите SMS съобщения за 6-цифрен код.\n\n[DEMO: Използвайте код 123456]",
        [{ text: "OK", onPress: () => setStep("sms_code") }]
      );
    } catch (error) {
      Alert.alert("Грешка", "Не успяхме да изпратим SMS код. Моля опитайте отново.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify SMS code
  const verifySMSCode = async () => {
    setIsLoading(true);

    if (smsCode.length !== 6) {
      Alert.alert("Грешка", "Моля въведете 6-цифрен код");
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Verify with backend
      // const response = await fetch('YOUR_API/verify-sms', {
      //   method: 'POST',
      //   body: JSON.stringify({ phone: phoneNumber, code: smsCode })
      // });
      
      console.log(`Verifying SMS code: ${smsCode}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo: Accept 123456
      if (smsCode === "123456") {
        setStep("email");
      } else {
        Alert.alert("Грешка", "Невалиден код. Моля опитайте отново.\n\n[DEMO: Използвайте 123456]");
      }
    } catch (error) {
      Alert.alert("Грешка", "Не успяхме да верифицираме кода.");
    } finally {
      setIsLoading(false);
    }
  };

  // Send email verification
  const sendEmailVerification = async () => {
    setIsLoading(true);

    if (!email.includes("@")) {
      Alert.alert("Грешка", "Моля въведете валиден имейл адрес");
      setIsLoading(false);
      return;
    }

    if (username.trim().length < 2) {
      Alert.alert("Грешка", "Моля въведете потребителско име (минимум 2 символа)");
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Send email verification
      // await fetch('YOUR_API/send-email-verification', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, phone: phoneNumber })
      // });
      
      console.log(`Sending email verification to: ${email}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        "Email изпратен",
        "Проверете вашата поща и кликнете върху линка за потвърждение.\n\n[DEMO: Натиснете 'Завърши' директно]",
        [{ text: "OK", onPress: () => setStep("email_verify") }]
      );
    } catch (error) {
      Alert.alert("Грешка", "Не успяхме да изпратим имейл за потвърждение.");
    } finally {
      setIsLoading(false);
    }
  };

  // Complete registration
  const completeRegistration = () => {
    registerUser(email, username);
    
    // Update phone verification status
    const user = useAppStore.getState().user;
    useAppStore.setState({
      user: {
        ...user,
        phoneNumber,
        isPhoneVerified: true,
        isEmailVerified: true,
      },
    });

    Alert.alert(
      "Регистрацията завърши успешно!",
      "Добре дошли в нашата общност!",
      [
        {
          text: "Започни",
          onPress: () => (navigation as any).navigate("Main"),
        },
      ]
    );
  };

  const renderPhoneStep = () => (
    <View className="flex-1 px-6">
      <View className="items-center mb-8">
        <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center mb-4">
          <Ionicons name="phone-portrait" size={40} color="#3b82f6" />
        </View>
        <Text className="text-2xl font-bold mb-2">Вашият телефон</Text>
        <Text className="text-gray-600 text-center">
          Ще ви изпратим SMS с 6-цифрен код за верификация
        </Text>
      </View>

      <View className="mb-6">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Телефонен номер
        </Text>
        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
          <Text className="text-gray-600 mr-2">🇧🇬 +359</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="87 XXX XXXX"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={15}
            className="flex-1 text-base"
          />
        </View>
        <Text className="text-xs text-gray-500 mt-2">
          Вашият номер няма да бъде споделян публично
        </Text>
      </View>

      <Pressable
        onPress={sendSMSCode}
        disabled={isLoading || phoneNumber.length < 10}
        className={`py-4 rounded-lg ${
          isLoading || phoneNumber.length < 10 ? "bg-gray-300" : "bg-blue-500"
        }`}
      >
        <Text className="text-white font-bold text-center text-lg">
          {isLoading ? "Изпращане..." : "Изпрати SMS код"}
        </Text>
      </Pressable>
    </View>
  );

  const renderSMSCodeStep = () => (
    <View className="flex-1 px-6">
      <View className="items-center mb-8">
        <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-4">
          <Ionicons name="chatbox-ellipses" size={40} color="#22c55e" />
        </View>
        <Text className="text-2xl font-bold mb-2">Въведете кода</Text>
        <Text className="text-gray-600 text-center">
          Изпратихме 6-цифрен код на {phoneNumber}
        </Text>
      </View>

      <View className="mb-6">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          SMS код
        </Text>
        <TextInput
          value={smsCode}
          onChangeText={setSmsCode}
          placeholder="123456"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          maxLength={6}
          className="bg-gray-100 rounded-lg px-4 py-3 text-center text-2xl tracking-widest font-bold"
          autoFocus
        />
      </View>

      <Pressable
        onPress={verifySMSCode}
        disabled={isLoading || smsCode.length !== 6}
        className={`py-4 rounded-lg mb-3 ${
          isLoading || smsCode.length !== 6 ? "bg-gray-300" : "bg-green-500"
        }`}
      >
        <Text className="text-white font-bold text-center text-lg">
          {isLoading ? "Проверка..." : "Потвърди"}
        </Text>
      </Pressable>

      <Pressable onPress={sendSMSCode} disabled={isLoading}>
        <Text className="text-blue-500 text-center font-semibold">
          Изпрати код отново
        </Text>
      </Pressable>
    </View>
  );

  const renderEmailStep = () => (
    <View className="flex-1 px-6">
      <View className="items-center mb-8">
        <View className="w-20 h-20 rounded-full bg-purple-100 items-center justify-center mb-4">
          <Ionicons name="mail" size={40} color="#8b5cf6" />
        </View>
        <Text className="text-2xl font-bold mb-2">Почти готово!</Text>
        <Text className="text-gray-600 text-center">
          Изберете потребителско име и въведете имейл
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Потребителско име
        </Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Вашето име"
          placeholderTextColor="#999"
          maxLength={30}
          className="bg-gray-100 rounded-lg px-4 py-3 text-base"
          autoCapitalize="words"
        />
      </View>

      <View className="mb-6">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Email адрес
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="example@email.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          className="bg-gray-100 rounded-lg px-4 py-3 text-base"
        />
        <Text className="text-xs text-gray-500 mt-2">
          Вашият имейл няма да бъде споделян публично
        </Text>
      </View>

      <Pressable
        onPress={sendEmailVerification}
        disabled={isLoading || !email.includes("@") || username.trim().length < 2}
        className={`py-4 rounded-lg ${
          isLoading || !email.includes("@") || username.trim().length < 2
            ? "bg-gray-300"
            : "bg-purple-500"
        }`}
      >
        <Text className="text-white font-bold text-center text-lg">
          {isLoading ? "Изпращане..." : "Продължи"}
        </Text>
      </Pressable>
    </View>
  );

  const renderEmailVerifyStep = () => (
    <View className="flex-1 px-6">
      <View className="items-center mb-8">
        <View className="w-20 h-20 rounded-full bg-amber-100 items-center justify-center mb-4">
          <Ionicons name="checkmark-circle" size={48} color="#f59e0b" />
        </View>
        <Text className="text-2xl font-bold mb-2">Проверете имейла</Text>
        <Text className="text-gray-600 text-center">
          Изпратихме линк за потвърждение на {email}
        </Text>
      </View>

      <View className="bg-blue-50 rounded-lg p-4 mb-6">
        <View className="flex-row items-start">
          <Ionicons name="information-circle" size={24} color="#3b82f6" />
          <View className="flex-1 ml-3">
            <Text className="text-sm text-blue-900 leading-5">
              Кликнете върху линка в имейла за да завършите регистрацията. 
              Проверете и SPAM папката ако не го намирате.
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={completeRegistration}
        className="bg-amber-500 py-4 rounded-lg mb-3"
      >
        <Text className="text-white font-bold text-center text-lg">
          Завърши регистрацията [DEMO]
        </Text>
      </Pressable>

      <Pressable onPress={sendEmailVerification}>
        <Text className="text-blue-500 text-center font-semibold">
          Изпрати имейл отново
        </Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-200 flex-row items-center">
        {step !== "phone" && (
          <Pressable
            onPress={() => {
              if (step === "sms_code") setStep("phone");
              else if (step === "email") setStep("sms_code");
              else if (step === "email_verify") setStep("email");
            }}
            className="mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Pressable>
        )}
        <Text className="text-xl font-bold">Регистрация</Text>
        <Pressable
          onPress={() => navigation.goBack()}
          className="ml-auto"
        >
          <Ionicons name="close" size={28} color="#666" />
        </Pressable>
      </View>

      {/* Progress indicator */}
      <View className="px-4 py-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-semibold text-gray-700">
            Стъпка {step === "phone" || step === "sms_code" ? "1" : "2"} от 2
          </Text>
          <Text className="text-sm text-gray-500">
            {step === "phone" && "SMS верификация"}
            {step === "sms_code" && "Код потвърждение"}
            {step === "email" && "Email регистрация"}
            {step === "email_verify" && "Email потвърждение"}
          </Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-blue-500 rounded-full"
            style={{
              width:
                step === "phone"
                  ? "25%"
                  : step === "sms_code"
                  ? "50%"
                  : step === "email"
                  ? "75%"
                  : "100%",
            }}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1" contentContainerClassName="flex-1">
          {step === "phone" && renderPhoneStep()}
          {step === "sms_code" && renderSMSCodeStep()}
          {step === "email" && renderEmailStep()}
          {step === "email_verify" && renderEmailVerifyStep()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Privacy note */}
      <View className="px-6 py-4 border-t border-gray-200">
        <Text className="text-xs text-gray-500 text-center leading-4">
          🔒 Ние събираме само телефон и имейл за верификация. 
          Тези данни няма да бъдат споделяни публично или продавани.
        </Text>
      </View>
    </SafeAreaView>
  );
}
