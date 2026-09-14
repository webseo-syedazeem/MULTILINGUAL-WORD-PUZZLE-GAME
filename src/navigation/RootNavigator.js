import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/OnboardingScreen";
import LanguageSelectScreen from "../screens/LanguageSelectScreen";
import LoginScreen from "../screens/LoginScreen";
import GameScreen from "../screens/GameScreen";
import MainTabs from "./MainTabs";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
      <Stack.Screen
        name="LanguageSelectFromHome"
        component={LanguageSelectScreen}
        initialParams={{ fromHome: true }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Game" component={GameScreen} />
    </Stack.Navigator>
  );
}
