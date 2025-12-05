import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { useRouter } from 'expo-router';
import NaviBar from '../naviBar';
import CategoryChips from '@/components/CategoryChips';
import { ScrollView } from 'react-native-gesture-handler';
import ActivityApplyBox from './activityApplyBox';
import DeptTab from './deptTab';
import { API_ENDPOINTS } from '@/config/api';

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

  const fetchEvents = async () => {
    if (selectedCategory === "기타") {
      setEvents([]);
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

      // 마감일 순으로 정렬
      const sortedData = data.sort((a, b) => {
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

      <ScrollView style={styles.contentArea}>
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

        {loading ? (
          <Text style={styles.loadingText}>로딩 중...</Text>
        ) : events.length > 0 ? (
          events.map((event) => {
            const dueDate = calculateDueDate(event.endDate);
            // 마감된 카드는 렌더링하지 않음
            if (dueDate === '마감') {
              return null;
            }
            return (
              <ActivityApplyBox
                key={event.id}
                event={event}
                tag={event.category}
                dueDate={dueDate}
                title={event.title}
                summarizedDescription={event.summarizedDescription}
              />
            );
          })
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
  contentArea: {
    marginTop: 30,
    marginBottom: 90,
    flex: 1, 
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
    paddingTop: 15,
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
});