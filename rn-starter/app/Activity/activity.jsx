import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import NaviBar from '../naviBar';
import CategoryChips from '@/components/CategoryChips';
import { ScrollView } from 'react-native-gesture-handler';
import ActivityApplyBox from './activityApplyBox';
import DeptTab from './deptTab';
import { API_ENDPOINTS } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Activity() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedDepartment, setSelectedDepartment] = useState("전체");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const categories = ["전체", "공모전", "대외 활동", "교내", "기타"];

  // 카테고리 한글 -> API 값 매핑
  const categoryMapping = {
    "전체": "전체",
    "공모전": "CONTEST",
    "대외 활동": "EXTERNAL",
    "교내": "SCHOOL",
  };

  // API에서 데이터 가져오기
  useEffect(() => {
    fetchEvents();
  }, [selectedDepartment, selectedCategory]);

  // 화면 포커스 시 최신 데이터 재조회 (기타 모집글 작성 후 복귀 등)
  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [selectedDepartment, selectedCategory])
  );

  const fetchEvents = async () => {
    if (selectedCategory === "기타") {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.warn('액세스 토큰이 없습니다. 로그인 후 다시 시도하세요.');
          setEvents([]);
          return;
        }

        const url = API_ENDPOINTS.GET_TEAMS({ category: '자율' });
        console.log('기타 팀 요청 URL:', url);
        const response = await fetch(url, {
          headers: { 
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const text = await response.text();

        if (!response.ok) {
          console.error('기타 팀 응답 상태 코드:', response.status, text.slice(0, 200));
          setEvents([]);
          return;
        }

        // 빈 응답 방어
        if (!text || text.trim().length === 0) {
          console.warn('기타 팀 응답이 비어 있습니다. status:', response.status);
          setEvents([]);
          return;
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('기타 팀 JSON 파싱 실패:', parseError, text.slice(0, 200));
          setEvents([]);
          return;
        }
        
        // 배열 처리
        let teamArray = Array.isArray(data) ? data : (data.data || []);
        
        // 모집 마감일 순으로 정렬
        const sorted = teamArray.sort((a, b) => 
          new Date(a.recruitmentEndDate) - new Date(b.recruitmentEndDate)
        );
        
        setEvents(sorted);
      } catch (error) {
        console.error('기타 팀 데이터 불러오기 실패:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      let url;

      // 카테고리 매핑
      const apiCategory = categoryMapping[selectedCategory];

      // API 호출 URL 결정
      if (selectedDepartment === "전체" && selectedCategory === "전체") {
        // 모든 이벤트
        url = API_ENDPOINTS.ALL_EVENTS;
      } else if (selectedDepartment !== "전체" && selectedCategory === "전체") {
        // 단과대별 전체 이벤트
        url = API_ENDPOINTS.SEARCH_BY_COLLEGE(selectedDepartment);
      } else if (selectedDepartment === "전체" && selectedCategory !== "전체") {
        // 카테고리별 전체 이벤트
        url = API_ENDPOINTS.SEARCH_BY_CATEGORY(apiCategory);
      } else {
        // 단과대 + 카테고리 필터링
        url = API_ENDPOINTS.SEARCH_EVENTS(selectedDepartment, apiCategory);
      }

      const response = await fetch(url);
      const data = await response.json();

      // data가 배열인지 확인 후 정렬
      const eventArray = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      const sortedData = eventArray.sort((a, b) => {
        const dateA = new Date(a.endDate);
        const dateB = new Date(b.endDate);
        return dateA - dateB;
      });

      setEvents(sortedData);
    }
    catch (error) {
      console.error('이벤트 데이터 불러오기 실패:', error);
      setEvents([]);
    }
    finally {
      setLoading(false);
    }
  };

  // 마감일 계산
  const calculateDueDate = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return '마감';
    if (diffDays === 0) return '오늘 마감';
    return `마감 D-${diffDays}`;
  };

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

      {/* 고정된 부분: DeptTab + CategoryChips */}
      <View style={styles.fixedHeader}>
        <DeptTab
          selectedDepartment={selectedDepartment}
          onSelectDepartment={setSelectedDepartment}
        />

        <View style={styles.chipsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScrollViewContent}
          >
            <CategoryChips
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </ScrollView>
        </View>
      </View>

      {/* 스크롤 가능한 부분: 이벤트 목록 */}
      <ScrollView style={styles.contentArea} contentContainerStyle={styles.scrollContentContainer}>
        {loading ? (
          <Text style={styles.loadingText}>로딩 중...</Text>
        ) : events.length > 0 ? (
          selectedCategory === "기타" ? (
            // 기타 카테고리: 팀 데이터 (eventId === null)
            events.map((team) => {
              const dueDate = calculateDueDate(team.recruitmentEndDate);
              if (dueDate === '마감' || !team.recruiting) return null;
              
              return (
                <TouchableOpacity 
                  key={team.id} 
                  style={styles.etcCard}
                  onPress={() => router.push({ pathname: '/Team/teamInfo2', params: { teamId: team.id } })}
                >
                  <View style={styles.etcHeader}>
                    <Text style={styles.etcStatus}>모집 중</Text>
                    <Text style={styles.etcDueDate}>{dueDate}</Text>
                  </View>
                  <Text style={styles.etcTitle}>{team.title}</Text>
                  <Text style={styles.etcPromotion} numberOfLines={2}>{team.promotionText}</Text>
                  <Text style={styles.etcRole}>{team.role?.join(', ')}</Text>
                </TouchableOpacity>
              );
            })
          ) : (
            // 기존 활동 카테고리
            events.map((event) => {
              const dueDate = calculateDueDate(event.endDate);
              if (dueDate === '마감') return null;

              return (
                <ActivityApplyBox
                  key={event.id}
                  event={event}
                  tag={event.category}
                  dueDate={dueDate}
                  title={event.title}
                  summarizedDescription={event.summarizedDescription}
                  startDate={event.startDate}
                  endDate={event.endDate}
                  clickable={true}
                />
              );
            })
          )
        ) : (
          <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
        )}
      </ScrollView>

      {selectedCategory === "기타" && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => router.push('./etcRecruitmentForm')}
        >
          <Image
            source={require('@/assets/images/plusBotton.png')}
            style={styles.plusIcon}
          />
        </TouchableOpacity>
      )}

      <NaviBar currentPage="activity" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  fixedHeader: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentArea: {
    marginTop: 220,
    marginBottom: 90,
    flex: 1, 
  },
  scrollContentContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Pretendard-Bold',
    marginTop: 100,   
    marginLeft: 20,
    marginBottom: 20, 
    paddingTop: 10,
    color: '#000',
    textAlign: 'left',
  },
  chipsWrapper: {
    paddingTop: 20,
    paddingLeft: 15,
  },
  chipScrollViewContent: {
    paddingRight: 30,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#999',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 110,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 999,
  },
  plusIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  etcCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  etcHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  etcStatus: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#166534',
    backgroundColor: '#DCFCE6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    overflow: 'hidden',
  },
  etcDueDate: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#666',
  },
  etcTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    marginBottom: 8,
  },
  etcPromotion: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  etcRole: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#3E6AF4',
  },
});