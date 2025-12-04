import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function recruitmentConfirmed() {
  const router = useRouter();

  return (
    <View style={styles.container}>
        <TouchableOpacity
          style={{ position: 'absolute', top: 60, right: 20, zIndex: 999, padding: 8 }}
          onPress={() => router.push('/Activity/activity')}
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
          tintColor="#3E6AF4"
        />
        <Text style={styles.title}>등록 완료</Text>
        <Text style={styles.text}>모집글이 성공적으로 등록되었습니다!{"\n"}알림 기능을 통해 지원 현황을 빠르게 확인해 보세요.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cancel: {
    width: 30,
    height: 30,
  },
  confirm: {
    marginTop: 300,
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 35,
    textAlign: 'center',
    color: '#000',
  },
   text: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    paddingTop: 10,
    textAlign: 'center',
    color: '#000',
  }
});
