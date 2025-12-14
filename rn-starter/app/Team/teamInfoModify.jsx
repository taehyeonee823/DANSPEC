import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity } from "react-native";
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_ENDPOINTS } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TeamInfoModify() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // id가 배열로 올 수 있으므로 처리
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      console.log('teamInfoModify params:', params);
      console.log('teamInfoModify id:', id);
      
      if (!id) {
        console.error('팀 ID가 없습니다. params:', params);
        setLoading(false);
        return;
      }

      const teamId = Number(id);
      if (Number.isNaN(teamId)) {
        console.error('유효하지 않은 팀 ID:', id);
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

        const url = API_ENDPOINTS.GET_TEAM_DETAIL(teamId);
        console.log('팀 상세 조회 URL:', url);
        
        const response = await fetch(url, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await response.text();

        if (!response.ok) {
          console.error('팀 상세 응답 상태 코드:', response.status, text.slice(0, 200));
          setLoading(false);
          return;
        }

        if (!text || text.trim().length === 0) {
          console.warn('팀 상세 응답이 비어 있습니다.');
          setLoading(false);
          return;
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('팀 상세 JSON 파싱 실패:', e, text.slice(0, 200));
          setLoading(false);
          return;
        }

        setTeam(data);
      } catch (error) {
        console.error('팀 정보 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

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
          <Text style={styles.readOnlyText}>{team.leaderName || team.name || ''}</Text>

          <Text style={styles.sectionTitle}>전공</Text>
          <View style={styles.departmentRow}>
            <View style={styles.collegeBox}>
              <Text>{team.leaderCollege || team.college || ''}</Text>
            </View>
            <View style={styles.majorBox}>
              <Text>{team.leaderMajor || team.major || ''}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>학년</Text>
          <Text style={styles.readOnlyText}>{team.leaderGrade || team.grade || ''}</Text>

          <Text style={styles.sectionTitle}>역할</Text>
          <Text style={styles.readOnlyText}>{team.requiredRoles?.join(', ') || team.role?.join(', ') || ''}</Text>

          <Text style={styles.sectionTitle}>특징</Text>
          <Text style={styles.readOnlyText}>{team.preferredTraits || team.trait || ''}</Text>
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
    marginTop: 20,
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
