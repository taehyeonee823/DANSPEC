import { useEffect } from 'react';
import { StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemedView style={styles.loadingContainer}>
      <Image
        source={require('@/assets/images/danspecLogo.png')}
        style={styles.loadingLogo}
        resizeMode="contain"
      />
      <ThemedText style={styles.loadingText}>DANSPEC</ThemedText>
      <ThemedText style={styles.loadingSubtext}>단국대 학생을 위한 스펙 업그레이드 네비게이터</ThemedText>
      <ActivityIndicator size="large" color="#fff" style={styles.spinner} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#215198',
    padding: 30,
  },
  loadingLogo: {
    width: '50%',
    height: 150,
    marginBottom: 30,
  },
  loadingText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  spinner: {
    marginTop: 30,
  },
});
