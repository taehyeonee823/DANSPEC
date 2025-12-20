import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Modal } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_ENDPOINTS } from '@/config/api';
import { dedupeRequest } from '@/utils/requestCache';
import { useUser } from '@/context/UserContext';
import NaviBar from '../naviBar';

export default function My() {
  const router = useRouter();
  const { userInfo: globalUserInfo, clearUserInfo } = useUser(); // 전역 사용자 정보
  const [hasNotification, setHasNotification] = useState(false); // 알림 여부 상태
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 로그아웃 모달 상태
  const [dreamyReport, setDreamyReport] = useState(null);
  const [participatedActivities, setParticipatedActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // 드림이 리포트와 참여 활동 정보 가져오기
  useEffect(() => {
    fetchDreamyData();
  }, []);

  const fetchDreamyData = async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');

      if (!token) {
        console.log('토큰이 없습니다. 로그인 페이지로 이동합니다.');
        router.replace('/login');
        return;
      }

      const url = API_ENDPOINTS.GET_USER_INFO;

      // 캐싱 및 중복 제거 적용 (60초 TTL)
      const { ok, status, text } = await dedupeRequest(url, async () => {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const text = await response.text();
        return { ok: response.ok, status: response.status, text };
      }, { ttlMs: 60000 });

      if (ok) {
        const data = JSON.parse(text);
        console.log('드림이 리포트 및 활동 정보:', data);

        if (data.success && data.data) {
          setDreamyReport(data.data.dreamyReport || null);
          setParticipatedActivities(data.data.participatedActivities || []);
        }
      } else {
        console.error('드림이 리포트 및 활동 정보 가져오기 실패:', status);
        // 토큰이 만료되었을 수 있으므로 로그인 페이지로 이동
        if (status === 401) {
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');
          router.replace('/login');
        }
      }
    } catch (error) {
      console.error('드림이 리포트 및 활동 정보 가져오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // SecureStore에서 토큰 삭제
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('autoLogin');
      await SecureStore.deleteItemAsync('savedEmail');

      // 전역 사용자 정보 클리어
      clearUserInfo();

      setShowLogoutModal(false);
      router.replace('/login');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  // 점수를 3단계로 분류하는 함수
  const getScoreLevel = (score) => {
    if (score >= 70) {
      return { level: '양호', color: '#4CAF50' };
    } else if (score >= 40) {
      return { level: '보완', color: '#FF9800' };
    } else {
      return { level: '개선', color: '#F44336' };
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
              : require('../../assets/images/bellDot.svg')
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
            <Text style={styles.profileName}>{globalUserInfo.name || '로딩 중...'}</Text>
            <Text style={styles.profileInfo}>
              {globalUserInfo.college && globalUserInfo.major && globalUserInfo.grade
                ? `${globalUserInfo.college} ${globalUserInfo.major} ${globalUserInfo.grade}학년`
                : '로딩 중...'}
            </Text>
            <Text style={styles.profileJob}>
              {globalUserInfo.interestJobPrimary
                ? `희망직무: ${globalUserInfo.interestJobPrimary}`
                : '로딩 중...'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('./modUserInfo')}>
          <Text style={styles.buttonText}>회원정보 수정</Text>
        </TouchableOpacity>

        <View style={styles.report}>
          <Image
            source={require('../../assets/images/dreame1.png')}
            style={styles.dreame}
            contentFit="contain"
          />
          <Text style={styles.reportText}>드림이 리포트</Text>
        </View>

        {/* 드림이 리포트 내용 */}
        {dreamyReport && (() => {
          const scoreLevel = getScoreLevel(dreamyReport.score);
          return (
            <View style={styles.reportContent}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>종합 분석</Text>
                <Text style={[styles.scoreValue, { color: scoreLevel.color }]}>
                  {scoreLevel.level}
                </Text>
              </View>

              <View style={styles.reportSection}>
                <Text style={styles.reportSectionTitle}>강점</Text>
                <Text style={styles.reportSectionText}>{dreamyReport.strength}</Text>
              </View>

              <View style={styles.reportSection}>
                <Text style={styles.reportSectionTitle}>약점</Text>
                <Text style={styles.reportSectionText}>{dreamyReport.weakness}</Text>
              </View>

              <View style={styles.reportSection}>
                <Text style={styles.reportSectionTitle}>추천 활동</Text>
                <Text style={styles.reportSectionText}>{dreamyReport.recommendedAction}</Text>
              </View>
            </View>
          );
        })()}

        {/* 참여 활동 섹션 - 상위 5개만 표시 */}
        {participatedActivities && participatedActivities.length > 0 && (
          <>
            <View style={styles.activitiesHeader}>
              <Text style={styles.activitiesTitle}>최근 활동</Text>
            </View>
            {participatedActivities.slice(0, 5).map((activity, index) => (
              <TouchableOpacity
                key={activity.id || index}
                style={styles.activityCard}
                onPress={() => {
                  // 팀 정보 페이지로 이동
                  router.push({
                    pathname: '/Team/teamInfo2',
                    params: {
                      teamId: String(activity.id),
                    },
                  });
                }}
              >
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityCategory}>{activity.category}</Text>
                </View>
                <Image
                  source={require('../../assets/images/right.svg')}
                  style={styles.rightIcon}
                  contentFit="contain"
                />
              </TouchableOpacity>
            ))}
          </>
        )}

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
            <Text style={styles.modalTitle}>로그아웃을 진행할까요?</Text>
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
  setting: {
    fontSize: 22,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    marginTop: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
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
    marginBottom: 10,
  },
  reportText: {
    fontSize: 22,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000'
  },
  dreame: {
    width: 40,
    height: 40,
    marginRight: 10,
    opacity: 1,
  },
  reportContent: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  scoreLabel: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#666',
  },
  scoreValue: {
    fontSize: 24,
    fontFamily: 'Pretendard-SemiBold',
    color: '#4869EC',
  },
  reportSection: {
    marginBottom: 16,
  },
  reportSectionTitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    marginBottom: 8,
  },
  reportSectionText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#555',
    lineHeight: 20,
  },
  activitiesHeader: {
    marginTop: 20,
    marginBottom: 15,
  },
  activitiesTitle: {
    fontSize: 22,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#000',
    marginBottom: 4,
  },
  activityCategory: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#666',
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
