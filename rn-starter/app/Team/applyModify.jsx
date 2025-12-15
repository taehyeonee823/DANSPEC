import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function ApplyConfirmed() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 60, right: 20, zIndex: 999, padding: 8 }}
        onPress={() => router.push('/Team/team')}
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
      <Text style={styles.title}>수정 완료</Text>
      <Text style={styles.text}>팀 지원글 수정이 완료되었습니다!{"\n"}팀장이 확인하기까지 기다려주세요.</Text>
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
