// 모집글 지원자가 '나'일 경우에 보는 팀 정보 화면

import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_ENDPOINTS } from '@/config/api';
import { fetchWithAuth } from '@/utils/auth';
import { dedupeRequest } from '@/utils/requestCache';
import Button from '../../components/Button';

export default function TeamInfo() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // teamId가 배열로 올 수 있으므로 처리
  const teamId = params.teamId ? (Array.isArray(params.teamId) ? params.teamId[0] : params.teamId) : null;
  const isMyTeam = params.isMyTeam === 'true';
  const hasAppliedParam = params.hasApplied === 'true';

  const [showAlreadyAppliedModal, setShowAlreadyAppliedModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(hasAppliedParam);

  // activityInfo에서 전달받은 팀 데이터 파싱
  let initialTeamData = null;
  if (params.teamData) {
    try {
      initialTeamData = JSON.parse(params.teamData);
    } catch (e) {
      console.error('팀 데이터 파싱 실패:', e);
    }
  }

  const [team, setTeam] = useState(initialTeamData);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!teamId) {
        console.warn('팀 ID가 없습니다.');
        setLoading(false);
        return;
      }

      const teamIdNum = Number(teamId);
      if (Number.isNaN(teamIdNum)) {
        console.error('유효하지 않은 팀 ID:', teamId);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const fetchedTeam = await dedupeRequest(
          `teamDetail:${teamIdNum}`,
          async () => {
            const teamUrl = API_ENDPOINTS.GET_TEAM_DETAIL(teamIdNum);
            const res = await fetchWithAuth(teamUrl, { method: 'GET' });
            if (!res.ok) {
              const t = await res.text().catch(() => '');
              throw new Error(`GET_TEAM_DETAIL failed: ${res.status} ${t.slice(0, 120)}`);
            }
            const json = await res.json();
            return (json && json.success && json.data) ? json.data : json;
          },
          { ttlMs: 3000 }
        );

        // leader/hasApplied
        if (typeof fetchedTeam?.hasApplied !== 'undefined') {
          setHasApplied(!!fetchedTeam.hasApplied);
        }

        // 전달받은 초기 데이터와 API 데이터를 병합 (API 데이터 우선)
        setTeam(prevTeam => ({
          ...prevTeam,
          ...fetchedTeam
        }));

        // 내가 쓴 모집글인 경우 사용자 정보도 가져오기
        if (isMyTeam) {
          const userRes = await fetchWithAuth(API_ENDPOINTS.USER_ME, { method: 'GET' });
          if (userRes.ok) {
            const json = await userRes.json().catch(() => null);
            const u = json && json.success && json.data ? json.data : json;
            if (u) setUserInfo(u);
          }
        }
      } catch (error) {
        console.error('네트워크 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId, isMyTeam]);

  const deleteTeam = async () => {
    if (!teamId) {
      return;
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        return;
      }

      const teamIdNum = Number(teamId);
      if (Number.isNaN(teamIdNum)) {
        return;
      }

      const deleteUrl = API_ENDPOINTS.DELETE_TEAM(teamIdNum);
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      router.replace('/Team/teamDeletedConfirmed');
    } catch (error) {
      console.error('모집글 삭제 오류:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  if (!team) {
    return (
      <View style={styles.center}>
        <Text>팀 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
        zIndex: 999
      }}>
        <TouchableOpacity
          style={{ padding: 8 }}
          onPress={() => router.back()}
        >
          <Image
            source={require('@/assets/images/left.svg')}
            style={{ width: 30, height: 30 }}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior="height" style={{ flex: 1, marginTop: 110 }}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.mainTitle}>{team.title}</Text>

          <Text style={styles.sectionTitle}>연결된 활동 / 공모전</Text>
          <Text style={styles.connectBox}>{team.connectedActivityTitle || '자율 모집'}</Text>

          <Text style={styles.sectionTitle}>팀장 이름</Text>
          <Text style={styles.readOnlyText}>
            {isMyTeam && userInfo ? userInfo.name : (team.leaderName || team.name || '')}
          </Text>

          <Text style={styles.sectionTitle}>학과</Text>
          <View style={styles.departmentRow}>
            <View style={styles.collegeBox}>
              <Text style={styles.collegeText}>
                {isMyTeam && userInfo ? userInfo.college : (team.leaderCollege || team.college || '')}
              </Text>
            </View>
            <View style={styles.majorBox}>
              <Text style={styles.majorText}>
                {isMyTeam && userInfo ? userInfo.major : (team.leaderMajor || team.major || '')}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>학년</Text>
          <View style={styles.departmentRow}>
            <View style={styles.collegeBox}>
              <Text style={styles.collegeText}>
                {isMyTeam && userInfo
                  ? (userInfo.grade ? `${userInfo.grade}학년` : '')
                  : (team.leaderGrade ? `${team.leaderGrade}학년` : (team.grade ? `${team.grade}학년` : ''))}
              </Text>
            </View>
            <Text style={styles.emptyBox}></Text>
          </View>

          <Text style={styles.sectionTitle}>모집 인원</Text>
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>{team.capacity || 0}명</Text>
          </View>

          <View style={styles.datePickerContainer}>
            <View>
              <Text style={styles.sectionTitle}>모집 시작날짜</Text>
              <View style={styles.datePickerButton}>
                <View style={styles.datePickerTextContainer}>
                  <Text style={styles.datePickerText}>
                    {team.recruitmentStartDate
                      ? new Date(team.recruitmentStartDate).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }).replace(/\s/g, '')
                      : '시작일 없음'}
                  </Text>
                </View>
                <Image
                  source={require('@/assets/images/calendar.svg')}
                  style={styles.datePickerArrow}
                  contentFit="contain"
                />
              </View>
            </View>

            <View>
              <Text style={styles.sectionTitle}>모집 마감날짜</Text>
              <View style={styles.datePickerButton}>
                <View style={styles.datePickerTextContainer}>
                  <Text style={styles.datePickerText}>
                    {team.recruitmentEndDate
                      ? new Date(team.recruitmentEndDate).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }).replace(/\s/g, '')
                      : '마감일 없음'}
                  </Text>
                </View>
                <Image
                  source={require('@/assets/images/calendar.svg')}
                  style={styles.datePickerArrow}
                  contentFit="contain"
                />
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>역할</Text>
          <Text style={styles.roleText}>
            {team.requiredRoles?.join(', ') || team.role?.join(', ') || ''}
          </Text>

          <Text style={styles.sectionTitle}>특징</Text>
          <Text style={styles.roleText}>
            {team.characteristic || team.trait || ''}
          </Text>

          <Text style={styles.sectionTitle}>진행 방식 및 소개</Text>
          <Text style={styles.descriptionBox}>{team.promotionText || team.description || ''}</Text>

          <View style={{ height: 20 }} />
          <Button
            title="지원하기"
            onPress={() => {
              if (hasApplied) {
                setShowAlreadyAppliedModal(true);
                return;
              }
              router.push({
                pathname: '/Team/teamApplicationForm',
                params: { teamId: teamId }
              });
            }}
          />

          <Modal
            visible={showAlreadyAppliedModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowAlreadyAppliedModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Image
                  source={require('../../assets/images/alert.svg')}
                  style={styles.alertIcon}
                  contentFit="contain"
                />
                <Text style={styles.modalTitle}>이미 지원한 모집글입니다.</Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowAlreadyAppliedModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>확인</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    width: 345,
    lineHeight: 24,
    fontSize: 22,
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 20,
    marginBottom: 12,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    marginBottom: 16,
    color: '#000',
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
  descriptionBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3E6AF433',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 28,
    fontFamily: 'Pretendard-Medium',
    color: '#A6A6A6',
    minHeight: 100,
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
  roleText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#A6A6A6',
    borderBottomColor: '#1A1A1A',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    marginBottom: 28,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  counterText: {
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    color: '#000',
    minWidth: 50,
    textAlign: 'center',
  },
  datePickerContainer: {
    gap: 10,
    marginBottom: 28,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3E6AF433',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 0,
  },
  datePickerTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  datePickerText: {
    fontSize: 16,
    color: '#000',
  },
  datePickerArrow: {
    width: 24,
    height: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  alertIcon: {
    width: 50,
    height: 50,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 24,
    color: '#000',
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
  },
});
