import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import DailyChallengeScreen from "../screens/DailyChallengeScreen";
import WorldsScreen from "../screens/WorldsScreen";
import ShopScreen from "../screens/ShopScreen";
import ProfileScreen from "../screens/ProfileScreen";
import GlassTabBar from "./GlassTabBar";
import { useT } from "../i18n/useT";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { t } = useT();

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <GlassTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t("tabs.home") }} />
      <Tab.Screen name="Daily" component={DailyChallengeScreen} options={{ tabBarLabel: t("tabs.daily") }} />
      <Tab.Screen name="Worlds" component={WorldsScreen} options={{ tabBarLabel: t("tabs.play") }} />
      <Tab.Screen name="Shop" component={ShopScreen} options={{ tabBarLabel: t("tabs.shop") }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t("tabs.profile") }} />
    </Tab.Navigator>
  );
}
