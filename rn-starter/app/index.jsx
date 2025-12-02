import { useEffect } from 'react';
import { StyleSheet, Image, ActivityIndicator, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.loadingContainer}>
      <Image
        source={require('@/assets/images/danspecLogo.png')}
        style={styles.loadingLogo}
        resizeMode="contain"
      />
      <Text style={styles.loadingText}>DANSPEC</Text>
      <Text style={styles.loadingSubtext}>단국대 학생을 위한 스펙 업그레이드 네비게이터</Text>
      <ActivityIndicator size="large" color="#4869EC" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    color: '#000',
    marginBottom: 15,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  spinner: {
    marginTop: 30,
    color: '#000',
  },
});
