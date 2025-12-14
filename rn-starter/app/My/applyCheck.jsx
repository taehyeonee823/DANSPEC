import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AlarmTab from './alarmTab';
import ApplierCard from './applierCard';
import { API_ENDPOINTS } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ApplyCheck() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const teamId = params.teamId ? (Array.isArray(params.teamId) ? params.teamId[0] : params.teamId) : null;
  
  const [activeTabIndex, setActiveTabIndex] = useState(0); // 0: 내가 쓴 모집글, 1: 내가 쓴 지원글
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teamTitle, setTeamTitle] = useState('');

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
      
      // API 응답을 ApplierCard에 맞게 매핑
      const mappedApplications = applicationsArray.map((app) => ({
        id: app.applicationId,
        name: app.applicant?.name || '',
        grade: app.applicant?.grade || '',
        campus: app.applicant?.campus || '',
        college: app.applicant?.college || '',
        major: app.applicant?.major || '',
        introduction: app.introduction || '',
        description: app.message || '',
        time: app.createdAt || '',
        status: app.status || '',
        onAccept: async (applicationId) => {
          console.log('승인:', applicationId);
          // TODO: 승인 API 호출
        },
        onReject: async (applicationId) => {
          console.log('거절:', applicationId);
          // TODO: 거절 API 호출
        },
      }));

      // 첫 번째 지원자의 teamTitle을 가져옴
      if (applicationsArray.length > 0 && applicationsArray[0].teamTitle) {
        setTeamTitle(applicationsArray[0].teamTitle);
      }

      setApplications(mappedApplications);
    } catch (error) {
      console.error('팀 지원자 목록 불러오기 실패:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

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
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 105,
          backgroundColor: '#ffffff',
          zIndex: 998,
        }}
      />
      <TouchableOpacity
        style={{ position: 'absolute', top: 60, left: 30, zIndex: 1000 }}
        onPress={() => router.push('/Home/home')}
      >
        <Image
          source={require('../../assets/images/danspecLogo.png')}
          style={{ width: 35, height: 35 }}
          contentFit="contain"
        />
      </TouchableOpacity>

      <View style={styles.fixedHeader}>
        <AlarmTab activeIndex={activeTabIndex} onChangeIndex={setActiveTabIndex} />
      </View>

      <ScrollView style={styles.contentArea} contentContainerStyle={styles.scrollContent}>
        {activeTabIndex === 0 && (
          <>
            {teamTitle ? (
              <View style={styles.titleContainer}>
                <Text style={styles.teamTitle}>{teamTitle}</Text>
              </View>
            ) : null}
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
          </>
        )}
        {activeTabIndex === 1 && (
          <></>
          // TODO: 내가 쓴 지원글 구현 예정
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
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: '#FFFFFF',
    zIndex: 998,
  },
  fixedHeader: {
    position: 'absolute',
    top: 35,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 999,
  },
  contentArea: {
    flex: 1,
    marginTop: 160,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 80,
    marginLeft: 20,
    marginBottom: 20,
    paddingTop: 10,
    color: '#000',
    textAlign: 'left',
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