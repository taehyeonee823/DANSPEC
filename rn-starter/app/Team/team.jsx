import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import NaviBar from '../naviBar';
import CategoryChips from '@/components/CategoryChips';
import TeamApplyBox from './teamApplyBox';
import TeamApplyBox2 from './teamApplyBox2';
import CategoryTab from './categoryTab';
import { API_ENDPOINTS } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Team() {
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(0); // 0: 내가 쓴 모집글, 1: 내가 쓴 지원글
  const [teams, setTeams] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);

  const formatDate = (value) => {
    if (!value || value === '-' || value === '상시 모집') return value || '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}. ${mm}. ${dd}`;
  };

  const fetchMyTeams = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.warn('액세스 토큰이 없습니다. 로그인 후 다시 시도하세요.');
        setTeams([]);
        return;
      }

      const url = API_ENDPOINTS.GET_TEAMS({ myPosts: true });
      console.log('내 모집글 조회 URL:', url);
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();

      if (!response.ok) {
        console.error('내 모집글 응답 상태 코드:', response.status, text.slice(0, 200));
        setTeams([]);
        return;
      }

      if (!text || text.trim().length === 0) {
        console.warn('내 모집글 응답이 비어 있습니다.');
        setTeams([]);
        return;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('내 모집글 JSON 파싱 실패:', e, text.slice(0, 200));
        setTeams([]);
        return;
      }

      const teamArray = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);

      // 각 팀의 모집 상태 계산
      const teamsWithRecruitingStatus = teamArray.map(team => {
        const currentMemberCount = team.currentMemberCount || team.currentMember || 0;
        const capacity = team.capacity;
        const recruitmentEndDate = team.recruitmentEndDate;

        // 정원이 찼거나 마감일이 지난 경우 recruiting을 false로 설정
        let recruiting = team.recruiting !== undefined ? team.recruiting : true;

        // 정원이 찬 경우
        if (capacity && currentMemberCount >= capacity) {
          recruiting = false;
        }

        // 마감일이 지난 경우
        if (recruitmentEndDate && recruitmentEndDate !== '상시 모집') {
          const endDate = new Date(recruitmentEndDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (!isNaN(endDate) && endDate < today) {
            recruiting = false;
          }
        }

        return {
          ...team,
          recruiting
        };
      });

      const sorted = teamsWithRecruitingStatus.sort((a, b) => {
        const aDate = new Date(a.recruitmentEndDate);
        const bDate = new Date(b.recruitmentEndDate);
        return aDate - bDate;
      });

      setTeams(sorted);
    } catch (error) {
      console.error('내 모집글 불러오기 실패:', error);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyApplications = useCallback(async () => {
    try {
      setLoadingApplications(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.warn('액세스 토큰이 없습니다. 로그인 후 다시 시도하세요.');
        setMyApplications([]);
        return;
      }

      const url = API_ENDPOINTS.GET_MY_APPLICATIONS;
      console.log('내 지원글 조회 URL:', url);

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();

      if (!response.ok) {
        console.error('내 지원글 응답 상태 코드:', response.status, text.slice(0, 200));
        setMyApplications([]);
        return;
      }

      if (!text || text.trim().length === 0) {
        console.warn('내 지원글 응답이 비어 있습니다.');
        setMyApplications([]);
        return;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('내 지원글 JSON 파싱 실패:', e, text.slice(0, 200));
        setMyApplications([]);
        return;
      }

      const appArray = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);

      // 최신 지원이 위로
      const sorted = [...appArray].sort((a, b) => {
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);
        return bDate - aDate;
      });

      setMyApplications(sorted);
    } catch (error) {
      console.error('내 지원글 불러오기 실패:', error);
      setMyApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  }, []);

  useEffect(() => {
    fetchMyTeams();
  }, [fetchMyTeams]);

  useEffect(() => {
    if (activeTabIndex === 1) {
      fetchMyApplications();
    }
  }, [activeTabIndex, fetchMyApplications]);

  useFocusEffect(
    useCallback(() => {
      if (activeTabIndex === 1) {
        fetchMyApplications();
      }
    }, [activeTabIndex, fetchMyApplications])
  );

  useFocusEffect(
    useCallback(() => {
      fetchMyTeams();
    }, [fetchMyTeams])
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
        <CategoryTab activeIndex={activeTabIndex} onChangeIndex={setActiveTabIndex} />
      </View>

      <ScrollView style={styles.contentArea} contentContainerStyle={styles.scrollContent}>
        {activeTabIndex === 0 && (
          <>
            {loading ? null : null}
            {teams.map((team) => (
              <TeamApplyBox
                key={team.id}
                dueDate={formatDate(team.recruitmentEndDate)}
                title={team.title}
                description={team.promotionText}
                tag={`연결된 활동: ${team.connectedActivityTitle || '자율 모집'}`}
                recruiting={team.recruiting}
                currentMemberCount={team.currentMemberCount || team.currentMember || 0}
                capacity={team.capacity}
                onPress={() => {
                  console.log('팀 카드 클릭, team.id:', team.id);
                  router.push({
                    pathname: '/Team/teamInfo',
                    params: {
                      teamId: String(team.id),
                      isMyTeam: 'true'
                    }
                  });
                }}
              />
            ))}
          </>
        )}
        {activeTabIndex === 1 && (
          <>
            {loadingApplications ? (
              <Text style={{ textAlign: 'center', marginTop: 40 }}>로딩 중...</Text>
            ) : myApplications.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 40 }}>지원글이 없습니다.</Text>
            ) : (
              myApplications.map((app) => {
                console.log('내 지원글 app 객체:', {
                  applicationId: app.applicationId,
                  status: app.status,
                  teamTitle: app.teamTitle,
                });
                return (
                <TeamApplyBox2
                  key={app.applicationId ?? `${app.teamId}-${app.createdAt}`}
                  dueDate={app.createdAt ? formatDate(app.createdAt) : '-'}
                  title={app.teamTitle || '(제목 없음)'}
                  description={app.introduction || app.message || ''}
                  tag={`상태: ${app.status || '-'}`}
                  onPress={() => {
                    router.push({
                      pathname: '/Team/teamApplicationForm2',
                      params: {
                        teamId: String(app.teamId),
                        applicationId: String(app.applicationId ?? ''),
                        introduction: app.introduction ?? '',
                        message: app.message ?? '',
                        contactNumber: app.contactNumber ?? '',
                        portfolioUrl: app.portfolioUrl ?? '',
                        status: app.status ?? '',
                        teamTitle: app.teamTitle ?? '',
                      },
                    });
                  }}
                />
              );
              })
            )}
          </>
        )}
      </ScrollView>
      <NaviBar currentPage="team" />
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
    top: 45,
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
    paddingTop: 10,
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
});