import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';

export default function RecruitmentConfirmed() {
  const router = useRouter();

  return (
    <View style={styles.container}>
        <TouchableOpacity
          style={{ position: 'absolute', top: 60, right: 20, zIndex: 999, padding: 8 }}
          onPress={() => router.push('/team')}
        >
          <Image
            source={require('@/assets/images/cancel.svg')}
            style={styles.cancel}
            contentFit="contain"
            tintColor="#000"
          />
        </TouchableOpacity>
        <Image
          source={require('@/assets/images/confirm.svg')}
          style={styles.confirm}
          contentFit="contain"
          tintColor="#3E6AF4"
        />
        <ThemedText style={styles.title}>신청 완료</ThemedText>
        <ThemedText style={styles.text}>신청이 완료되었습니다!{"\n"}새로운 모집글을 더 둘러 보세요.</ThemedText>
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
