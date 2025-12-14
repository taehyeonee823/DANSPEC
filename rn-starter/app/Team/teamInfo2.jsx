// 모집글 지원자가 '나'일 경우에 보는 팀 정보 화면

import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity } from "react-native";
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_ENDPOINTS } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TeamInfo() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // teamId가 배열로 올 수 있으므로 처리
  const teamId = params.teamId ? (Array.isArray(params.teamId) ? params.teamId[0] : params.teamId) : null;
  const isMyTeam = params.isMyTeam === 'true';

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
        const token = await AsyncStorage.getItem('accessToken');

        if (!token) {
          console.warn('액세스 토큰이 없습니다.');
          setLoading(false);
          return;
        }

        // 팀 정보 가져오기
        const teamUrl = API_ENDPOINTS.GET_TEAM_DETAIL(teamIdNum);
        const teamResponse = await fetch(teamUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const teamText = await teamResponse.text();

        if (!teamResponse.ok) {
          console.error('API 에러:', teamResponse.status, teamText);
          setLoading(false);
          return;
        }

        if (!teamText || teamText.trim().length === 0) {
          console.warn('빈 응답');
          setLoading(false);
          return;
        }

        let teamData;
        try {
          teamData = JSON.parse(teamText);
        } catch (e) {
          console.error('JSON 파싱 실패:', e);
          setLoading(false);
          return;
        }

        // API 응답이 {success: true, data: {...}} 형식이므로 data.data를 사용
        let fetchedTeam;
        if (teamData.success && teamData.data) {
          fetchedTeam = teamData.data;
        } else {
          fetchedTeam = teamData;
        }

        // 전달받은 초기 데이터와 API 데이터를 병합 (API 데이터 우선)
        setTeam(prevTeam => ({
          ...prevTeam,
          ...fetchedTeam
        }));

        // 내가 쓴 모집글인 경우 사용자 정보도 가져오기
        if (isMyTeam) {
          const userUrl = API_ENDPOINTS.USER_ME;
          const userResponse = await fetch(userUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          const userText = await userResponse.text();

          if (userResponse.ok && userText && userText.trim().length > 0) {
            try {
              const userData = JSON.parse(userText);
              if (userData.success && userData.data) {
                setUserInfo(userData.data);
              } else {
                setUserInfo(userData);
              }
            } catch (e) {
              console.error('사용자 정보 JSON 파싱 실패:', e);
            }
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
      <TouchableOpacity
        style={{ position: 'absolute', top: 60, left: 8, zIndex: 999, padding: 8 }}
        onPress={() => router.back()}
      >
        <Image
          source={require('@/assets/images/left.svg')}
          style={{ width: 30, height: 30 }}
          contentFit="contain"
        />
      </TouchableOpacity>

      <KeyboardAvoidingView behavior="height" style={{ flex: 1, marginTop: 110 }}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.mainTitle}>{team.title}</Text>

          <Text style={styles.sectionTitle}>연결된 활동 / 공모전</Text>
          <Text style={styles.connectBox}>{team.connectedActivityTitle || '자율 모집'}</Text>

          <Text style={styles.sectionTitle}>진행 방식 및 소개</Text>
          <Text style={styles.descriptionBox}>{team.promotionText || team.description || ''}</Text>

          <Text style={styles.sectionTitle}>팀장 이름</Text>
          <Text style={styles.connectBox}>
            {isMyTeam && userInfo ? userInfo.name : (team.leaderName || team.name || '')}
          </Text>

          <Text style={styles.sectionTitle}>전공</Text>
          <Text style={styles.connectBox}>
            {isMyTeam && userInfo
              ? `${userInfo.college || ''} ${userInfo.major || ''}`.trim()
              : `${team.leaderCollege || team.college || ''} ${team.leaderMajor || team.major || ''}`.trim()
            }
          </Text>

          <Text style={styles.sectionTitle}>학년</Text>
          <Text style={styles.connectBox}>
            {isMyTeam && userInfo ? userInfo.grade : (team.leaderGrade || team.grade || '')}
          </Text>

          <Text style={styles.sectionTitle}>역할</Text>
          <Text style={styles.connectBox}>{team.requiredRoles?.join(', ') || team.role?.join(', ') || ''}</Text>

          <Text style={styles.sectionTitle}>특징</Text>
          <Text style={styles.connectBox}>{team.characteristic || team.trait || ''}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
    color: '#000',
  },
  connectBox: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    fontSize: 14,
    color: '#000',
  },
  descriptionBox: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    fontSize: 14,
    color: '#000',
    minHeight: 100,
  },
  readOnlyText: {
    fontSize: 14,
    color: '#000',
    paddingVertical: 10,
  },
  departmentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  collegeBox: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
  },
  majorBox: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
  },
});
