import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import NaviBar from '../naviBar';
import CategoryChips from '@/components/CategoryChips';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ["전체", "공모전", "대외 활동", "교내", "기타"];

  const categoryMapping = {
    "전체": "전체",
    "공모전": "CONTEST",
    "대외 활동": "EXTERNAL",
    "교내": "SCHOOL",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedDepartment, selectedCategory]);

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
        const response = await fetch(url, {
          headers: { 
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const text = await response.text();

        if (!response.ok) {
          setEvents([]);
          return;
        }

        if (!text || text.trim().length === 0) {
          setEvents([]);
          return;
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          setEvents([]);
          return;
        }
        
        let teamArray = Array.isArray(data) ? data : (data.data || []);
        const sorted = teamArray.sort((a, b) => 
          new Date(a.recruitmentEndDate) - new Date(b.recruitmentEndDate)
        );
        
        setEvents(sorted);
      } catch (error) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      let url;

      const apiCategory = categoryMapping[selectedCategory];

      if (selectedDepartment === "전체" && selectedCategory === "전체") {
        url = API_ENDPOINTS.ALL_EVENTS;
      } else if (selectedDepartment !== "전체" && selectedCategory === "전체") {
        url = API_ENDPOINTS.SEARCH_BY_COLLEGE(selectedDepartment);
      } else if (selectedDepartment === "전체" && selectedCategory !== "전체") {
        url = API_ENDPOINTS.SEARCH_BY_CATEGORY(apiCategory);
      } else {
        url = API_ENDPOINTS.SEARCH_EVENTS(selectedDepartment, apiCategory);
      }

      const response = await fetch(url);
      const data = await response.json();

      const eventArray = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      const sortedData = eventArray.sort((a, b) => {
        const dateA = new Date(a.endDate);
        const dateB = new Date(b.endDate);
        return dateA - dateB;
      });

      setEvents(sortedData);
    }
    catch (error) {
      setEvents([]);
    }
    finally {
      setLoading(false);
    }
  };

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
      <View style={styles.topHeaderRow}>
        <TouchableOpacity
          style={styles.logoButton}
          onPress={() => router.push('/Home/home')}
        >
          <Image
            source={require('../../assets/images/danspecLogo.png')}
            style={{ width: 35, height: 35 }}
            contentFit="contain"
          />
        </TouchableOpacity>

        {isSearchOpen ? (
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="검색어를 입력하세요"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
          </View>
        ) : (
          <View style={styles.searchBoxPlaceholder} />
        )}

        <TouchableOpacity
          style={styles.searchIconButton}
          onPress={() => {
            setIsSearchOpen((v) => {
              const next = !v;
              if (!next) setSearchQuery('');
              return next;
            });
          }}
        >
          <Image
            source={require('../../assets/images/search.svg')}
            style={{ width: 28, height: 28 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

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

      <ScrollView style={styles.contentArea} contentContainerStyle={styles.scrollContentContainer}>
        {loading ? (
          <Text style={styles.loadingText}>로딩 중...</Text>
        ) : (() => {
          const filteredEvents = events.filter((item) => {
            if (!searchQuery.trim()) return true;
            const title = selectedCategory === "기타" ? item.title : item.title;
            return title?.toLowerCase().includes(searchQuery.toLowerCase());
          });

          if (filteredEvents.length === 0) {
            return <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>;
          }

          return selectedCategory === "기타" ? (
            filteredEvents.map((team) => {
              const dueDate = calculateDueDate(team.recruitmentEndDate);
              if (dueDate === '마감' || !team.recruiting) return null;

              return (
                <TouchableOpacity
                  key={team.id}
                  style={styles.etcCard}
                  onPress={() => {
                    router.push({ pathname: '/Team/teamInfo2', params: { teamId: String(team.id) } });
                  }}
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
            filteredEvents.map((event) => {
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
          );
        })()}
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
  topHeaderRow: {
    position: 'absolute',
    top: 60,
    left: 30,
    right: 30,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoButton: {
    zIndex: 1000,
  },
  searchBox: {
    flex: 1,
    marginLeft: 15,
    marginRight: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 35,
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: 12,
    paddingLeft: 5,
    fontFamily: 'Pretendard-Regular',
    color: '#333',
  },
  searchBoxPlaceholder: {
    flex: 1,
    marginHorizontal: 10,
  },
  searchIconButton: {
    zIndex: 1000,
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
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
    fontFamily: 'Pretendard-Reguar',
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