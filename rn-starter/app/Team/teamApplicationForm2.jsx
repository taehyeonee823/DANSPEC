import { Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, Modal } from "react-native";
import React, { useState, useEffect } from "react";
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_ENDPOINTS } from '@/config/api';
import Button from '../../components/Button';
import MultiplelineInput from '../../components/MultiplelineInput';
import SinglelineInput from '../../components/SinglelineInput';

export default function Index() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const teamId = params.teamId ? (Array.isArray(params.teamId) ? params.teamId[0] : params.teamId) : null;
  const applicationId = params.applicationId ? (Array.isArray(params.applicationId) ? params.applicationId[0] : params.applicationId) : null;

  const initialIntroduction = params.introduction ? (Array.isArray(params.introduction) ? params.introduction[0] : params.introduction) : '';
  const initialMessage = params.message ? (Array.isArray(params.message) ? params.message[0] : params.message) : '';
  const initialContactNumber = params.contactNumber ? (Array.isArray(params.contactNumber) ? params.contactNumber[0] : params.contactNumber) : '';
  const initialPortfolioUrl = params.portfolioUrl ? (Array.isArray(params.portfolioUrl) ? params.portfolioUrl[0] : params.portfolioUrl) : '';

  const [motivationInfo, setMotivation] = useState(initialMessage);
  const [introductionInfo, setIntroduction] = useState(initialIntroduction);
  const [portfolioLink, setPortfolioLink] = useState(initialPortfolioUrl);
  const [contactInfo, setContactInfo] = useState(initialContactNumber);

  const [userInfo, setUserInfo] = useState({
    name: '',
    college: '',
    major: '',
    grade: '',
  });
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [teamTitle, setTeamTitle] = useState(params.title ? (Array.isArray(params.title) ? params.title[0] : params.title) : '');
  const [teamDetail, setTeamDetail] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(params.status ? (Array.isArray(params.status) ? params.status[0] : params.status) : null);
  const canEdit = applicationStatus === 'PENDING';

  const [showStatusBlockedModal, setShowStatusBlockedModal] = useState(false);
  const [showMemberCountModal, setShowMemberCountModal] = useState(false);

  const isFinalStatus = applicationStatus === 'APPROVED' || applicationStatus === 'REJECTED';

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) {
          setLoadingUser(false);
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
          if (data.success && data.data) {
            setUserInfo({
              name: data.data.name || '',
              college: data.data.college || '',
              major: data.data.major || '',
              grade: data.data.grade || '',
            });
          }
        }
      } catch (e) {
        // ignore
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchTeamDetail = async () => {
      if (!teamId) return;
      const teamIdNum = Number(teamId);
      if (Number.isNaN(teamIdNum)) return;

      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) return;

        const url = API_ENDPOINTS.GET_TEAM_DETAIL(teamIdNum);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await response.text();
        if (!response.ok || !text || text.trim().length === 0) return;

        const json = JSON.parse(text);
        const data = json?.success && json?.data ? json.data : json;
        setTeamDetail(data);

        if (data?.title) setTeamTitle(data.title);
      } catch (e) {
        // ignore
      }
    };

    fetchTeamDetail();
  }, [teamId]);

  useEffect(() => {
    const fetchMyApplicationDetail = async () => {
      if (!applicationId) return;
      const applicationIdNum = Number(Array.isArray(applicationId) ? applicationId[0] : applicationId);
      if (Number.isNaN(applicationIdNum)) return;

      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) return;

        // 캐시로 이전 값이 보이는 케이스 방지용
        const baseUrl = API_ENDPOINTS.GET_TEAM_APPLICATION_DETAIL(applicationIdNum);
        const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}_ts=${Date.now()}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await response.text();
        if (!response.ok || !text || text.trim().length === 0) return;

        const json = JSON.parse(text);
        const data = json?.success && json?.data ? json.data : json;

        if (typeof data?.introduction === 'string') setIntroduction(data.introduction);
        if (typeof data?.message === 'string') setMotivation(data.message);
        if (typeof data?.contactNumber === 'string') setContactInfo(data.contactNumber);
        else if (data?.contactNumber == null) setContactInfo('');
        if (typeof data?.portfolioUrl === 'string') setPortfolioLink(data.portfolioUrl);
        else if (data?.portfolioUrl == null) setPortfolioLink('');

        if (data?.status) setApplicationStatus(data.status);
      } catch (e) {
        // ignore
      }
    };

    fetchMyApplicationDetail();
  }, [applicationId]);

  const handleSubmit = async () => {
    if (!canEdit) {
      if (isFinalStatus) {
        setShowStatusBlockedModal(true);
        return;
      }
      return;
    }

    if (!applicationId) {
      return;
    }

    try {
      setSubmitting(true);
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        return;
      }

      const applicationIdNum = typeof applicationId === 'string' ? parseInt(applicationId, 10) : applicationId;
      const url = API_ENDPOINTS.UPDATE_TEAM_APPLICATION(applicationIdNum);

      const requestBody = {
        introduction: introductionInfo,
        message: motivationInfo,
        contactNumber: contactInfo.trim() || null,
        portfolioUrl: portfolioLink.trim() || null,
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        return;
      }

      router.push({
        pathname: '/Team/applyModify',
        params: {
          teamId: teamId ?? undefined,
          applicationId: applicationId ?? undefined,
        },
      });
    } catch (error) {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (isFinalStatus) {
      setShowStatusBlockedModal(true);
      return;
    }

    if (!applicationId) {
      return;
    }

    try {
      setSubmitting(true);
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        return;
      }

      const applicationIdNum = typeof applicationId === 'string' ? parseInt(applicationId, 10) : applicationId;
      const url = API_ENDPOINTS.DELETE_TEAM_APPLICATION(applicationIdNum);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      router.back();
    } catch (error) {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBarButton} onPress={() => router.back()}>
          <Image
            source={require('@/assets/images/left.svg')}
            style={styles.topBarIcon}
            contentFit="contain"
          />
        </TouchableOpacity>

        {/* 삭제하기: PENDING일 때만 표시 */}
        {canEdit && (
        <TouchableOpacity
          style={styles.topBarButton}
          onPress={handleDelete}
          disabled={submitting}
        >
          <Text style={[styles.topBarActionText, submitting && styles.disabledText]}>삭제하기</Text>
        </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView behavior="height" style={styles.body}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.mainTitle}>{teamDetail?.title || teamTitle || '제목 없음'}</Text>

          <Text style={styles.sectionTitle}>연결된 활동 / 공모전</Text>
          <Text style={styles.connectBox}>{teamDetail?.connectedActivityTitle || '자율 모집'}</Text>

          <Text style={styles.sectionTitle}>이름</Text>
          <Text style={styles.readOnlyText}>
            {loadingUser ? '불러오는 중...' : (userInfo.name || '정보 없음')}
          </Text>

          <Text style={styles.sectionTitle}>학과</Text>
          <View style={styles.departmentRow}>
            <View style={styles.collegeBox}>
              <Text style={styles.collegeText}>
                {loadingUser ? '불러오는 중...' : (userInfo.college || '정보 없음')}
              </Text>
            </View>
            <View style={styles.majorBox}>
              <Text style={styles.majorText}>
                {loadingUser ? '불러오는 중...' : (userInfo.major || '정보 없음')}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>학년</Text>
          <View style={styles.departmentRow}>
            <View style={styles.collegeBox}>
              <Text style={styles.collegeText}>
                {loadingUser ? '불러오는 중...' : (userInfo.grade ? `${userInfo.grade}학년` : '정보 없음')}
              </Text>
            </View>
            <Text style={styles.emptyBox} />
          </View>

          <Text style={styles.sectionTitle}>간단 소개글</Text>
          <View style={styles.readOnlyMultilineBox}>
            <Text style={styles.readOnlyMultilineText}>
              {introductionInfo || '입력된 내용이 없습니다.'}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>지원 동기</Text>
          <View style={styles.readOnlyMultilineBox}>
            <Text style={styles.readOnlyMultilineText}>
              {motivationInfo || '입력된 내용이 없습니다.'}
            </Text>
          </View>


          <Text style={styles.sectionTitle}>연락처</Text>
          <SinglelineInput
            value={contactInfo}
            onChangeText={setContactInfo}
            placeholder="연락처를 입력해주세요."
            editable={canEdit}
          />

          <Text style={styles.sectionTitle}>포트폴리오 / 깃허브 링크</Text>
          <SinglelineInput
            value={portfolioLink}
            onChangeText={setPortfolioLink}
            placeholder="포트폴리오나 깃허브 링크를 입력해주세요."
            editable={canEdit}
          />
          {/* 수정하기: PENDING일 때만 표시 */}
          {canEdit && (
          <Button
            title={submitting ? '제출 중...' : '수정하기'}
              onPress={handleSubmit}
              disabled={submitting}
            style={{ marginTop: 20 }}
          />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 상태 제한 모달 (my.jsx 로그아웃 모달 스타일 참조) */}
      <Modal
        visible={showStatusBlockedModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStatusBlockedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image
              source={require('@/assets/images/alert.svg')}
              style={styles.alertIcon}
              contentFit="contain"
            />
            <Text style={styles.modalTitle}>이미 승인/거절된 지원글입니다.</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => setShowStatusBlockedModal(false)}
              >
                <Text style={styles.confirmButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    zIndex: 999,
  },
  topBarButton: {
    padding: 8,
  },
  topBarIcon: {
    width: 30,
    height: 30,
  },
  topBarActionText: {
    fontSize: 17,
    color: '#000',
    fontFamily: 'Pretendard-SemiBold',
  },
  disabledText: {
    opacity: 0.5,
  },
  body: {
    flex: 1,
    marginTop: 110,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    paddingBottom: 50,
    zIndex: 900,
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000', 
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    marginBottom: 16,
    color: '#000',
  },
  readOnlyText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#A6A6A6',
    borderBottomColor: '#1A1A1A',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    marginBottom: 28,
    flex: 1,
  },
  readOnlyMultilineBox: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#3E6AF433',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  readOnlyMultilineText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: '#000',
    lineHeight: 24,
  },
  departmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 28,
  },
  collegeBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3E6AF433',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  majorBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3E6AF433',
    justifyContent: 'center',
    alignItems: 'center',
  },
  collegeText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#A6A6A6',
  },
  majorText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#A6A6A6',
  },
  emptyBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3E6AF433',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    textAlign: 'center',
    marginBottom: 28,
    fontFamily: 'Pretendard-SemiBold',
    color: '#A6A6A6',
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
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
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
  confirmButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#000',
  },
});
