import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import NaviBar from '../naviBar';
import { ThemedText } from '@/components/themed-text';

export default function My() {
  const router = useRouter();
  const [hasNotification, setHasNotification] = useState(false); // 알림 여부 상태

  return (
    <View style={styles.container}>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 105,
        backgroundColor: '#ffffff',
        zIndex: 998
      }} />

      <TouchableOpacity
          style={{ position: 'absolute', top: 60, left: 30, zIndex: 999 }}
          onPress={() => router.push('/Home/home')}
        >
          <Image
            source={require('../../assets/images/danspecLogo.png')}
            style={{ width: 35, height: 35 }}
            contentFit="contain"
          />
      </TouchableOpacity>

      <TouchableOpacity
          style={{ position: 'absolute', top: 60, right: 30, zIndex: 999 }}
          onPress={() => {
            console.log('Bell 눌림');
          }}
        >
          <Image
            source={hasNotification
              ? require('../../assets/images/notificationBell.png')
              : require('../../assets/images/bell.png')
            }
            style={{ width: 33, height: 33 }}
            contentFit="contain"
          />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.title}>이곳은 마이 화면 입니다.</ThemedText>
      </ScrollView>

      <NaviBar currentPage="my" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 85,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 50,
    color: '#000',
    textAlign: 'left',
  },
});
