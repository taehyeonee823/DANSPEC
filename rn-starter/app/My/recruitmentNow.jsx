import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import RecruitmentCard from './recruitmentCard';
import AlarmTab from './alarmTab';
import { API_ENDPOINTS } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecruitmentNow() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.warn('액세스 토큰이 없습니다. 로그인 후 다시 시도하세요.');
        setTeamData([]);
        return;
      }

      // 수신함: 내가 지원한 팀 모집글 조회 (또는 받은 요청들)
      // TODO: API 엔드포인트 확인 필요 - 현재는 모든 팀을 가져오도록 설정
      const url = API_ENDPOINTS.GET_TEAMS({myPosts: true});
      console.log('수신함 팀 조회 URL:', url);
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();

      if (!response.ok) {
        console.error('수신함 팀 응답 상태 코드:', response.status, text.slice(0, 200));
        setTeamData([]);
        return;
      }

      if (!text || text.trim().length === 0) {
        console.warn('수신함 팀 응답이 비어 있습니다.');
        setTeamData([]);
        return;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('수신함 팀 JSON 파싱 실패:', e, text.slice(0, 200));
        setTeamData([]);
        return;
      }

      const teamArray = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      setTeamData(teamArray);
    } catch (error) {
      console.error('수신함 팀 불러오기 실패:', error);
      setTeamData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useFocusEffect(
    useCallback(() => {
      fetchTeams();
    }, [fetchTeams])
  );

  // status 계산 함수
  const today = new Date();
  const getStatus = (dueDate) => {
    if (!dueDate || dueDate === '상시 모집') return '팀 모집 중';
    const due = new Date(dueDate);
    if (!isNaN(due) && due < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      return '마감';
    }
    return '팀 모집 중';
  };

  // status를 동적으로 계산하여 분류
  const activeTeams = teamData
    .map(team => ({ ...team, status: getStatus(team.recruitmentEndDate || team.dueDate) }))
    .filter(team => team.status !== '마감');
  const closedTeams = teamData
    .map(team => ({ ...team, status: getStatus(team.recruitmentEndDate || team.dueDate) }))
    .filter(team => team.status === '마감');

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/My/my')}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>
          수신함
        </Text>
      </View>

      <View style={styles.fixedAlarmTab}>
        <AlarmTab />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>현재 모집 중</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>로딩 중...</Text>
          </View>
        ) : (
          <>
            {activeTeams.length === 0 && closedTeams.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>수신된 팀 모집 요청이 없습니다.</Text>
              </View>
            ) : (
              <>
                {activeTeams.map((team) => (
                  <RecruitmentCard
                    key={team.id}
                    id={team.id}
                    status={team.status}
                    dueDate={team.recruitmentEndDate || team.dueDate}
                    title={team.title}
                    capacity={team.capacity}
                  />
                ))}
              </>
            )}
          </>
        )}

         <View style={styles.titleContainer}>
          <Text style={styles.title}>마감</Text>
        </View>

        {!loading && closedTeams.length > 0 && (
          <>
            {closedTeams.map((team) => (
              <RecruitmentCard
                key={team.id}
                id={team.id}
                status={team.status}
                dueDate={team.recruitmentEndDate || team.dueDate}
                title={team.title}
                capacity={team.capacity}
              />
            ))}
          </>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  headerBar: {
    height: 44, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 8,
    position: 'absolute', 
    left: 20,
    zIndex: 1,
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
  fixedAlarmTab: {
    backgroundColor: '#FFFFFF',
    zIndex: 10, 
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  title: {
    fontSize: 15,
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