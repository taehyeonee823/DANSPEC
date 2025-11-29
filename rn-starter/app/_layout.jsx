import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
          <Stack.Screen name="Team/teamRecruitmentConfirmed" />
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
