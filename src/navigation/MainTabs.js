import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import DailyChallengeScreen from "../screens/DailyChallengeScreen";
import WorldMapScreen from "../screens/WorldMapScreen";
import ShopScreen from "../screens/ShopScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { colors, shadow } from "../theme";

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: { active: "home", inactive: "home-outline" },
  Daily: { active: "calendar", inactive: "calendar-outline" },
  Play: { active: "map", inactive: "map-outline" },
  Shop: { active: "storefront", inactive: "storefront-outline" },
  Profile: { active: "person", inactive: "person-outline" },
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: "rgba(255,255,255,0.65)",
        tabBarStyle: {
          backgroundColor: "rgba(10, 41, 26, 0.95)",
          borderTopWidth: 1.2,
          borderTopColor: "rgba(245, 196, 81, 0.25)",
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          ...shadow,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700", marginTop: -2 },
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = focused ? ICONS[route.name].active : ICONS[route.name].inactive;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Daily" component={DailyChallengeScreen} />
      <Tab.Screen name="Play" component={WorldMapScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

