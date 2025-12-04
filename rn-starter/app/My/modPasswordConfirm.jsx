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
          onPress={() => router.push('../login')}
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
        <Text style={styles.title}>변경 완료</Text>
        <Text style={styles.text}>비밀번호 변경이 완료되었습니다!{"\n"}이용을 위해 재로그인 해주세요.</Text>
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
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 35,
    paddingTop: 10,
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
