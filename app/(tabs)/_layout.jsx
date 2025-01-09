import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "lightgrey",
        tabBarStyle: { backgroundColor: "white", height: 60 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/10473/10473299.png",
              }}
              width={25}
              height={25}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarLabel: "setting",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/3953/3953226.png",
              }}
              width={25}
              height={25}
            />
          ),
          headerShown : false
        }}
      />
    </Tabs>
  );
}
