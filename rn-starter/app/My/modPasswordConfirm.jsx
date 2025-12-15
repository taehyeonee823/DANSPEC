import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ApplyConfirmed() {
  const router = useRouter();

  useEffect(() => {
    // 화면이 마운트될 때 로그아웃 처리
    const handleLogout = async () => {
      try {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('autoLogin');
        await AsyncStorage.removeItem('savedEmail');
      } catch (error) {
        console.error('로그아웃 오류:', error);
      }
    };
    
    handleLogout();
  }, []);

  return (
    <View style={styles.container}>
        <TouchableOpacity
          style={{ position: 'absolute', top: 60, right: 20, zIndex: 999, padding: 8 }}
          onPress={() => router.replace('/login')}
        >
          <Image
            source={require('@/assets/images/cancel.svg')}
            style={styles.cancel}
            contentFit="contain"
            tintColor="#000"
          />
        </TouchableOpacity>
        <Image
          source={require('@/assets/images/Check circle.svg')}
          style={styles.confirm}
          contentFit="contain"
        />
        <Text style={styles.title}>변경 완료</Text>
        <Text style={styles.text}>비밀번호 변경이 완료되었습니다!{"\n"}이용을 위해 재로그인 해주세요.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancel: {
    width: 30,
    height: 30,
  },
  confirm: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 25,
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 16,
    textAlign: 'center',
    color: '#000',
  },
   text: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    marginTop: 24,
    textAlign: 'center',
    color: '#000',
  }
});
