import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Modal } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '@/config/api';
import NaviBar from '../naviBar';

export default function My() {
  const router = useRouter();
  const [hasNotification, setHasNotification] = useState(false); // 알림 여부 상태
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 로그아웃 모달 상태
  const [userInfo, setUserInfo] = useState({
    name: '',
    college: '',
    major: '',
    grade: '',
    interestJobPrimary: '',
    interestJobSecondary: '',
    interestJobTertiary: '',
  });
  const [loading, setLoading] = useState(true);

  // 사용자 정보 가져오기
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        console.log('토큰이 없습니다. 로그인 페이지로 이동합니다.');
        router.replace('/login');
        return;
      }

      const response = await fetch(API_ENDPOINTS.USER_ME, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('사용자 정보:', data);

        if (data.success && data.data) {
          setUserInfo({
            name: data.data.name || '',
            college: data.data.college || '',
            major: data.data.major || '',
            grade: data.data.grade || '',
            interestJobPrimary: data.data.interestJobPrimary || '',
            interestJobSecondary: data.data.interestJobSecondary || '',
            interestJobTertiary: data.data.interestJobTertiary || '',
          });
        }
      } else {
        console.error('사용자 정보 가져오기 실패:', response.status);
        // 토큰이 만료되었을 수 있으므로 로그인 페이지로 이동
        if (response.status === 401) {
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('refreshToken');
          router.replace('/login');
        }
      }
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // AsyncStorage에서 토큰 삭제
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('autoLogin');
      await AsyncStorage.removeItem('savedEmail');

      setShowLogoutModal(false);
      router.replace('/login');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

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
            router.push('./notificationScreen');
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
            <Text style={styles.profileName}>{loading ? '로딩 중...' : userInfo.name}</Text>
            <Text style={styles.profileInfo}>
              {loading ? '로딩 중...' : `${userInfo.college} ${userInfo.major} ${userInfo.grade}학년`}
            </Text>
            <Text style={styles.profileJob}>
              {loading ? '로딩 중...' : `희망직무: ${userInfo.interestJobPrimary}`}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('./modUserInfo')}>
          <Text style={styles.buttonText}>회원정보 수정</Text>
        </TouchableOpacity>

        <View style={styles.report}>
          <Image
            source={require('../../assets/images/dreame.png')}
            style={styles.dreame}
            contentFit="contain"
          />
          <Text style={styles.reportText}>드림이 리포트</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.setting}>계정 설정</Text>

        <TouchableOpacity
          style={styles.modPasswordContainer}
          onPress={() => router.push('./modPassword')}
        >
          <Text style={styles.modPassword}>비밀번호 변경</Text>
          <Image
            source={require('../../assets/images/right.svg')}
            style={styles.rightIcon}
            contentFit="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modPasswordContainer}
          onPress={() => setShowLogoutModal(true)}
        >
          <Text style={styles.logout}>로그아웃</Text>
          <Image
            source={require('../../assets/images/right.svg')}
            style={styles.rightIcon}
            contentFit="contain"
          />
        </TouchableOpacity>

      </ScrollView>

      {/* 로그아웃 확인 모달 */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image
              source={require('../../assets/images/alert.svg')}
              style={styles.alertIcon}
              contentFit="contain"
            />
            <Text style={styles.modalTitle}>로그아웃 하시겠어요?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton]}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>로그아웃</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    marginBottom: 6,
  },
  profileInfo: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#000',
    marginBottom: 6,
  },
  profileJob: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
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
    fontFamily: 'Pretendard-Medium'
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
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    marginBottom: 20,
  },
  modPasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modPassword: {
    fontSize: 17,
    fontFamily: 'Pretendard-Regular',
    color: '#000',
  },
  rightIcon: {
    width: 20,
    height: 20,
  },
  logout: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: '#000',
  },
  report: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  reportText: {
    fontSize: 22,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
  },
  dreame: {
    width: 40,
    height: 40,
    marginRight: 10,
    opacity: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    alignItems: 'center',
  },
  alertIcon: {
    width: 48,
    height: 48,
    flexShrink: 0,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    marginTop: 10,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#3E6AF4',
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#FFFFFF',
  },
});
