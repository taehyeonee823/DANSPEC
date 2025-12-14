import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ApplierCard from './applierCard';
import { API_ENDPOINTS } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ApplyCheck() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const teamId = params.teamId ? (Array.isArray(params.teamId) ? params.teamId[0] : params.teamId) : null;
  const [applications, setApplications] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teamTitle, setTeamTitle] = useState('');
  const [teamCapacity, setTeamCapacity] = useState(0);

  const fetchTeamApplications = useCallback(async () => {
    console.log('fetchTeamApplications 호출, teamId:', teamId, 'type:', typeof teamId);
    
    if (!teamId) {
      console.warn('팀 ID가 없습니다. params:', params);
      setApplications([]);
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.warn('액세스 토큰이 없습니다. 로그인 후 다시 시도하세요.');
        setApplications([]);
        return;
      }

      // teamId를 숫자로 변환 (필요한 경우)
      const teamIdNum = typeof teamId === 'string' ? parseInt(teamId, 10) : teamId;
      if (isNaN(teamIdNum)) {
        console.error('유효하지 않은 teamId:', teamId);
        setApplications([]);
        return;
      }

      const url = API_ENDPOINTS.GET_TEAM_APPLICATIONS(teamIdNum);
      console.log('팀 지원자 목록 조회 URL:', url);
      console.log('teamIdNum:', teamIdNum);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const text = await response.text();
      console.log('응답 상태:', response.status);
      console.log('응답 본문:', text.slice(0, 500));
      console.log('전체 응답 데이터:', text);

      if (!response.ok) {
        console.error('팀 지원자 목록 응답 상태 코드:', response.status);
        console.error('에러 응답 본문:', text);
        setApplications([]);
        return;
      }

      if (!text || text.trim().length === 0) {
        console.warn('팀 지원자 목록 응답이 비어 있습니다.');
        setApplications([]);
        return;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('팀 지원자 목록 JSON 파싱 실패:', e, text.slice(0, 200));
        setApplications([]);
        return;
      }

      const applicationsArray = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      
      // 승인된 멤버와 대기 중인 지원자 분리
      const pendingApplications = [];
      const approvedMembers = [];
      
      applicationsArray.forEach((app) => {
        // grade 값 정규화 (숫자만 추출하거나 "?/2" 같은 형태 처리)
        let normalizedGrade = app.applicant?.grade || '';
        // "?/2" 같은 형태를 처리하거나, 숫자만 추출
        if (normalizedGrade && typeof normalizedGrade === 'string') {
          // "?/2" 같은 형태면 빈 문자열로 처리하거나, 숫자만 추출
          if (normalizedGrade.includes('?') || normalizedGrade.includes('/')) {
            // 숫자만 추출 시도 (예: "?/2" -> "2", "1/2" -> "1")
            const match = normalizedGrade.match(/\d+/);
            normalizedGrade = match ? `${match[0]}학년` : '';
          } else if (!normalizedGrade.includes('학년')) {
            // 숫자만 있으면 "학년" 추가
            const match = normalizedGrade.match(/\d+/);
            normalizedGrade = match ? `${match[0]}학년` : normalizedGrade;
          }
        }
        
        console.log('원본 grade:', app.applicant?.grade, '-> 정규화된 grade:', normalizedGrade);
        
        const mappedApp = {
          id: app.applicationId,
          name: app.applicant?.name || '',
          grade: normalizedGrade,
          campus: app.applicant?.campus || '',
          college: app.applicant?.college || '',
          major: app.applicant?.major || '',
          introduction: app.introduction || '',
          description: app.message || '',
          time: app.createdAt || '',
          status: app.status || '',
        };

        // status가 'APPROVED'이거나 'ACCEPTED'인 경우 멤버로 분류
        if (app.status === 'APPROVED' || app.status === 'ACCEPTED') {
          approvedMembers.push(mappedApp);
        } else {
          // 대기 중인 지원자는 승인/거절 함수 추가
          pendingApplications.push({
            ...mappedApp,
            onAccept: async (applicationId) => {
              await handleApplicationAction(applicationId, true);
            },
            onReject: async (applicationId) => {
              await handleApplicationAction(applicationId, false);
            },
          });
        }
      });

      // 첫 번째 지원자의 teamTitle과 capacity를 가져옴
      if (applicationsArray.length > 0) {
        if (applicationsArray[0].teamTitle) {
          setTeamTitle(applicationsArray[0].teamTitle);
        }
        if (applicationsArray[0].capacity) {
          setTeamCapacity(applicationsArray[0].capacity);
        }
      }

      // 팀 상세 정보에서 capacity 가져오기
      try {
        const teamDetailUrl = API_ENDPOINTS.GET_TEAM_DETAIL(teamIdNum);
        const teamDetailResponse = await fetch(teamDetailUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (teamDetailResponse.ok) {
          const teamDetailText = await teamDetailResponse.text();
          if (teamDetailText && teamDetailText.trim().length > 0) {
            try {
              const teamDetailData = JSON.parse(teamDetailText);
              const teamData = teamDetailData.success && teamDetailData.data ? teamDetailData.data : teamDetailData;
              if (teamData.capacity) {
                setTeamCapacity(teamData.capacity);
              }
            } catch (e) {
              console.error('팀 상세 정보 JSON 파싱 실패:', e);
            }
          }
        }
      } catch (error) {
        console.error('팀 상세 정보 가져오기 실패:', error);
      }

      setApplications(pendingApplications);
      setMembers(approvedMembers);
    } catch (error) {
      console.error('팀 지원자 목록 불러오기 실패:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  const handleApplicationAction = useCallback(async (applicationId, isApproved) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.warn('액세스 토큰이 없습니다.');
        return;
      }

      const url = API_ENDPOINTS.UPDATE_APPLICATION(applicationId, isApproved);
      console.log('지원서 처리 URL:', url);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('지원서 처리 실패:', response.status, text);
        return;
      }

      // 성공 시 목록 다시 불러오기
      await fetchTeamApplications();
    } catch (error) {
      console.error('지원서 처리 중 오류:', error);
    }
  }, [fetchTeamApplications]);

  useEffect(() => {
    if (teamId) {
      fetchTeamApplications();
    }
  }, [teamId, fetchTeamApplications]);

  useFocusEffect(
    useCallback(() => {
      if (teamId) {
        fetchTeamApplications();
      }
    }, [teamId, fetchTeamApplications])
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>수신함</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Image
            source={require('../../assets/images/xCircle.svg')}
            style={styles.closeIcon}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentArea} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>가입 요청</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>로딩 중...</Text>
          </View>
        ) : applications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>지원자가 없습니다.</Text>
          </View>
        ) : (
          applications.map((application) => (
            <ApplierCard
              key={application.id}
              id={application.id}
              name={application.name}
              grade={application.grade}
              campus={application.campus}
              college={application.college}
              major={application.major}
              introduction={application.introduction}
              description={application.description}
              time={application.time}
              onAccept={application.onAccept}
              onReject={application.onReject}
              navigateToApplyCheck={false}
            />
          ))
        )}
        
        <View style={styles.memberHeader}>
          <Text style={styles.title}>현재 멤버</Text>
          {teamCapacity > 0 && (
            <Text style={styles.memberCount}>{members.length} / {teamCapacity}</Text>
          )}
        </View>
        {loading ? null : members.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>멤버가 없습니다.</Text>
          </View>
        ) : (
          members.map((member) => (
            <ApplierCard
              key={member.id}
              id={member.id}
              name={member.name}
              grade={member.grade}
              campus={member.campus}
              college={member.college}
              major={member.major}
              introduction={member.introduction}
              description={member.description}
              time={member.time}
              hideButtons={true}
              navigateToApplyCheck={false}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: '#000',
    fontWeight: 'bold',
  },
  screenTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    padding: 8,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  contentArea: {
    flex: 1,
    marginTop: 0,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 20,
    paddingTop: 10,
    color: '#000',
    textAlign: 'left',
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  memberCount: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#666',
    marginBottom: 20,
    paddingTop: 10,
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  teamTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    textAlign: 'left',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#666',
  },
});