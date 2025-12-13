import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import NaviBar from '../naviBar';
import CategoryChips from '@/components/CategoryChips';
import TeamApplyBox from './teamApplyBox';
import CategoryTab from './categoryTab';
import { API_ENDPOINTS } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Team() {
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(0); // 0: 내가 쓴 모집글, 1: 내가 쓴 지원글
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

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

      const sorted = teamArray.sort((a, b) => {
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

  useEffect(() => {
    fetchMyTeams();
  }, [fetchMyTeams]);

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
                dueDate={team.recruitmentEndDate}
                title={team.title}
                description={team.promotionText}
                tag={`연결된 활동: ${team.connectedActivityTitle || '자율 모집'}`}
                onPress={() => router.push(`/Team/teamInfoModify?id=${team.id}&title=${encodeURIComponent(team.title)}`)}
              />
            ))}
          </>
        )}
        {activeTabIndex === 1 && (
          <></>
          // TODO: 내가 쓴 지원글 구현 예정
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
});