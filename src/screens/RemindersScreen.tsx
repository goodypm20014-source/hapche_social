import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Switch, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../state/appStore";
import * as Notifications from "expo-notifications";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface Reminder {
  id: string;
  supplementName: string;
  time: string;
  days: number[]; // 0 = Sunday, 1 = Monday, etc.
  stackName: string;
  enabled: boolean;
}

const DAYS_BG = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export default function RemindersScreen() {
  const user = useAppStore((s) => s.user);
  const stacks = useAppStore((s) => s.stacks);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    // Request notification permissions
    requestNotificationPermissions();
    
    // Load reminders from active stacks
    loadRemindersFromStacks();
  }, [stacks]);

  const requestNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== "granted") {
      console.log("Notification permissions not granted");
    }
  };

  const loadRemindersFromStacks = () => {
    const allReminders: Reminder[] = [];
    
    stacks.forEach((stack) => {
      if (stack.reminders && stack.reminders.length > 0) {
        stack.reminders.forEach((reminder) => {
          allReminders.push({
            id: `${stack.id}-${reminder.supplementName}-${reminder.time}`,
            supplementName: reminder.supplementName,
            time: reminder.time,
            days: reminder.days,
            stackName: stack.name,
            enabled: true,
          });
        });
      }
    });
    
    setReminders(allReminders);
    
    // Schedule notifications for enabled reminders
    allReminders.forEach((reminder) => {
      if (reminder.enabled) {
        scheduleNotification(reminder);
      }
    });
  };

  const scheduleNotification = async (reminder: Reminder) => {
    const [hours, minutes] = reminder.time.split(":").map(Number);
    
    // Schedule for each day
    reminder.days.forEach(async (day) => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ Време за ${reminder.supplementName}`,
          body: `От stack: ${reminder.stackName}`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          weekday: day === 0 ? 1 : day + 1, // expo uses 1=Sunday, 2=Monday
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });
    });
  };

  const toggleReminder = async (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === reminderId) {
          const newEnabled = !r.enabled;
          
          if (newEnabled) {
            scheduleNotification(r);
          } else {
            // Cancel notifications for this reminder
            cancelNotification(r);
          }
          
          return { ...r, enabled: newEnabled };
        }
        return r;
      })
    );
  };

  const cancelNotification = async (reminder: Reminder) => {
    // Cancel all scheduled notifications (simple approach)
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Re-schedule all enabled reminders except this one
    reminders.forEach((r) => {
      if (r.enabled && r.id !== reminder.id) {
        scheduleNotification(r);
      }
    });
  };

  if (user.tier === "guest") {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
        <View className="px-4 py-3 border-b border-gray-200 bg-white" style={{ paddingTop: 50, height: 60 }} />

        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-amber-100 w-24 h-24 rounded-full items-center justify-center mb-6">
            <Ionicons name="notifications" size={48} color="#f59e0b" />
          </View>
          <Text className="text-3xl font-bold text-center mb-3">
            Напомняния
          </Text>
          <Text className="text-center text-gray-600 text-base leading-6 mb-8">
            Регистрирайте се безплатно за да получавате напомняния за прием на добавки
          </Text>
          <Pressable className="bg-amber-500 px-10 py-4 rounded-xl">
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
      <View className="px-4 py-3 border-b border-gray-200 bg-white" style={{ paddingTop: 50, height: 60 }} />

      <ScrollView className="flex-1">
        {reminders.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8 py-16">
            <Ionicons name="alarm-outline" size={64} color="#ccc" />
            <Text className="text-gray-400 text-lg mt-4 text-center">
              Няма настроени напомняния
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              Създайте stack с напомняния за да виждате тук
            </Text>
          </View>
        ) : (
          <View className="px-4 py-4">
            <View className="flex-row items-center mb-4">
              <Ionicons name="alarm" size={24} color="#f59e0b" />
              <Text className="text-lg font-bold ml-2">
                Активни напомняния ({reminders.filter((r) => r.enabled).length})
              </Text>
            </View>

            {reminders.map((reminder) => (
              <View
                key={reminder.id}
                className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="font-bold text-lg mb-1">
                      {reminder.supplementName}
                    </Text>
                    <View className="flex-row items-center">
                      <Ionicons name="layers-outline" size={14} color="#666" />
                      <Text className="text-sm text-gray-600 ml-1">
                        {reminder.stackName}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={reminder.enabled}
                    onValueChange={() => toggleReminder(reminder.id)}
                    trackColor={{ false: "#d1d5db", true: "#f59e0b" }}
                    thumbColor={reminder.enabled ? "#fff" : "#f3f4f6"}
                  />
                </View>

                <View className="flex-row items-center mb-2">
                  <Ionicons name="time-outline" size={20} color="#3b82f6" />
                  <Text className="text-base font-semibold ml-2">
                    {reminder.time}
                  </Text>
                </View>

                <View className="flex-row items-center flex-wrap">
                  {reminder.days.map((day) => (
                    <View
                      key={day}
                      className="bg-blue-100 rounded-full w-8 h-8 items-center justify-center mr-2 mb-1"
                    >
                      <Text className="text-xs font-semibold text-blue-700">
                        {DAYS_BG[day]}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Info section */}
        <View className="mx-4 my-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={20} color="#3b82f6" />
            <View className="flex-1 ml-3">
              <Text className="text-sm text-blue-900 leading-5">
                Напомнянията се настройват автоматично от вашите активни стакове. Ще получавате нотификации на телефона в зададеното време.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
