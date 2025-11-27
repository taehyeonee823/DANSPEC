import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import NaviBar from '../naviBar';
import CategoryChips from '@/components/CategoryChips';
import { ThemedText } from '@/components/themed-text';
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
  const categories = ["전체", "공모전", "대외 활동", "교내", "자율 프로젝트"];

  // API에서 이벤트 데이터 가져오기
  useEffect(() => {
    fetchEvents();
  }, [selectedDepartment, selectedCategory]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let url;

      // API 호출 URL 결정
      if (selectedDepartment === "전체" && selectedCategory === "전체") {
        // 모든 이벤트
        url = API_ENDPOINTS.ALL_EVENTS;
      } else if (selectedDepartment !== "전체" && selectedCategory === "전체") {
        // 단과대별 전체 이벤트
        url = API_ENDPOINTS.SEARCH_BY_COLLEGE(selectedDepartment);
      } else if (selectedDepartment === "전체" && selectedCategory !== "전체") {
        // 카테고리별 전체 이벤트
        url = API_ENDPOINTS.SEARCH_EVENTS("전체", selectedCategory);
      } else {
        // 단과대 + 카테고리 필터링
        url = API_ENDPOINTS.SEARCH_EVENTS(selectedDepartment, selectedCategory);
      }

      const response = await fetch(url);
      const data = await response.json();
      setEvents(data);
    }
    catch (error) {
      console.error('이벤트 데이터 불러오기 실패:', error);
      setEvents([]);
    }
    finally {
      setLoading(false);
    }
  };

  // 마감일 계산 (D-day 형식으로)
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
          <ThemedText style={styles.loadingText}>로딩 중...</ThemedText>
        ) : events.length > 0 ? (
          events.map((event) => (
            <ActivityApplyBox
              key={event.id}
              tag={event.category}
              dueDate={calculateDueDate(event.endDate)}
              title={event.title}
              description={event.description}
            />
          ))
        ) : (
          <ThemedText style={styles.emptyText}>검색 결과가 없습니다.</ThemedText>
        )}

      </ScrollView>
      
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
    flex: 1, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,   
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
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
});