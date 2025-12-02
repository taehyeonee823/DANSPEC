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
            router.push('/My/recruitmentNow');
          }}
        >
          <Image
            source={hasNotification
              ? require('../../assets/images/notificationBell.svg')
              : require('../../assets/images/bell.svg')
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
        {/* 프로필 박스 */}
        <View style={styles.profileBox}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require('@/assets/images/user.svg')}
              style={styles.profileImage}
              contentFit="cover"
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>지은</Text>
            <Text style={styles.profileInfo}>SW융합대학 통계데이터사이언스학과 3학년</Text>
            <Text style={styles.profileJob}>희망직무: 데이터분석가 (삼성전자)</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('')}>
          <Text style={styles.buttonText}>회원정보 수정</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.setting}>계정 설정</Text>

        <TouchableOpacity onPress={() => router.push('./modPassword')}>
          <Text style={styles.modPassword}>비밀번호 변경</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('../login')}>
          <Text style={styles.logout}>로그아웃</Text>
        </TouchableOpacity>

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
  profileBox: {
    backgroundColor: '#FFFFFF',
    marginTop: 40,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '60%',
    height: '60%',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
  },
  profileInfo: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    marginBottom: 4,
  },
  profileJob: {
    fontSize: 14,
    fontWeight: '300',
    color: '#000',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#A2B3F4',
    alignItems: 'center'
  },
  buttonText: {
    color: '#4869EC',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 8,
    backgroundColor: '#D9D9D9',
    marginTop: 30,
    marginBottom: 15,
    marginLeft: -30,
    marginRight: -30,
  },
  setting: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000',
    marginBottom: 20,
  },
  modPassword: {
    fontSize: 16,
    fontWeight: '400',
    color: '#4869EC',
    marginBottom: 10,
  },
  logout: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FF0000',
  },
});
