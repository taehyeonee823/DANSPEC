import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.ttf'),
      'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.ttf'),
      'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.ttf'),
      'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="Home/home" />
          <Stack.Screen name="Team/teamApplicationForm" />
          <Stack.Screen name="Team/teamRecruitmentForm" />
          <Stack.Screen name="Team/applyConfirmed" />
          <Stack.Screen name="Activity/recruitmentConfirmed" />
          <Stack.Screen name="Team/teamInfo" />
          <Stack.Screen name="Team/team" />
          <Stack.Screen name="Activity/activity" />
          <Stack.Screen name="My/my" />
          <Stack.Screen name="My/applyCheck" />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
