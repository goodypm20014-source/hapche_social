import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useState, useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import { useAppStore } from "./src/state/appStore";

/*
IMPORTANT NOTICE: DO NOT REMOVE
There are already environment keys in the project. 
Before telling the user to add them, check if you already have access to the required keys through bash.
Directly access them with process.env.${key}

Correct usage:
process.env.EXPO_PUBLIC_VIBECODE_{key}
//directly access the key

Incorrect usage:
import { OPENAI_API_KEY } from '@env';
//don't use @env, its depreicated

Incorrect usage:
import Constants from 'expo-constants';
const openai_api_key = Constants.expoConfig.extra.apikey;
//don't use expo-constants, its depreicated

*/

export default function App() {
  const hasCompletedOnboarding = useAppStore((s) => s.user.hasCompletedOnboarding);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setShowWelcome(!hasCompletedOnboarding);
  }, [hasCompletedOnboarding]);

  if (showWelcome) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <WelcomeScreen onComplete={completeOnboarding} />
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
