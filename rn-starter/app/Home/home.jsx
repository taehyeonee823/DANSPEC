import React, { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useRouter} from 'expo-router';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '@/config/api';
import NaviBar from '../naviBar';
import ActivityApplyBox from '../Activity/activityApplyBox';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [userName, setUserName] = useState('사용자');
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const scrollViewRef = useRef(null);
  const [aiMission, setAiMission] = useState('');
  // 사용자 정보 불러오기
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');

        if (!token) {
          console.log('토큰이 없습니다.');
          return;
        }

        // API에서 사용자 정보 가져오기
        const response = await fetch(API_ENDPOINTS.USER_ME, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('홈 사용자 정보:', data);

          if (data.success && data.data && data.data.name) {
            setUserName(data.data.name);
          }
        } else if (response.status === 401) {
          // 토큰 만료
          console.log('토큰이 만료되었습니다.');
        }
      } catch (error) {
        console.error('사용자 정보 불러오기 실패:', error);
      }
    };
    loadUserInfo();
  }, []);

  // 활동 데이터 불러오기
  useEffect(() => {
    let cancelled = false;

    const loadActivities = async () => {
      setLoadingActivities(true);
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await fetch(API_ENDPOINTS.RECOMMENDED_EVENTS, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });

        if (response.ok) {
          const data = await response.json();

          const activitiesArray = Array.isArray(data)
            ? data
            : (Array.isArray(data.data) ? data.data : []);

          const categories = ['CONTEST', 'EXTERNAL', 'SCHOOL'];
          const selectedActivities = [];

          categories.forEach(category => {
            const activityInCategory = activitiesArray.find(activity => activity.category === category);
            if (activityInCategory) {
              selectedActivities.push(activityInCategory);
            }
          });

          if (!cancelled) setActivities(selectedActivities);
        } else {
          if (!cancelled) setActivities([]);
        }
      } catch (error) {
        console.error('활동 데이터 불러오기 실패:', error);
        if (!cancelled) setActivities([]);
      } finally {
        if (!cancelled) setLoadingActivities(false);
      }
    };

    loadActivities();
    return () => {
      cancelled = true;
    };
  }, []);

  // 슬라이드 자동 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = prevIndex === 0 ? 1 : 0;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
        return nextIndex;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);


  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };
  
  // AI 미션 불러오기
  useEffect(() => {
    const fetchAiMission = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        
        if (!token) {
          console.log('토큰이 없습니다.');
          return;
        }

        const response = await fetch(API_ENDPOINTS.GET_AI_MISSION, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          console.log('AI 미션 데이터:', result);
          
          // 응답 형식: { success: true, message: "성공", data: { mission: "..." } }
          if (result.success && result.data && result.data.mission) {
            setAiMission(result.data.mission);
          } else {
            console.log('미션 데이터가 없습니다.');
          }
        } else if (response.status === 401) {
          console.log('토큰이 만료되었습니다.');
        } else {
          const errorText = await response.text();
          console.error('AI 미션 불러오기 실패:', response.status, errorText);
        }
      } catch (error) {
        console.error('AI 미션 불러오기 실패:', error);
      }
    };

    fetchAiMission();
  }, []);

  return (
    <View style={styles.container}>
      {/* 고정된 부분: 슬라이드 + 제목 */}
      <View style={styles.fixedHeader}>
        <View style={styles.imageContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
          {/* 첫 번째 슬라이드 */}
          <View style={{ width }}>
            <LinearGradient
              colors={['#4D90CC', '#fff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1, paddingTop: 150 }}
            >
              <View style={styles.slideContent}>
                <View style={styles.leftBox}>
                  <TouchableOpacity style={styles.button} onPress={() => 
                    router.push('/Activity/activity')}>
                    <Text style={styles.buttonText}>추천 보러가기</Text>
                  </TouchableOpacity>

                  <Text style={styles.slideTitle}>지금 시작해 볼만한 활동</Text>

                  <Text style={styles.sub}>
                    공모전부터 교내 · 대외 활동까지!{'\n'}드림이가 나만을 위해 골라봤어요
                  </Text>
                </View>

                <Image
                  source={require('@/assets/images/dreame.png')}
                  style={styles.logo1}
                  resizeMode="contain"
                />
              </View>
            </LinearGradient>
          </View>

          {/* 두 번째 슬라이드 */}
          <View style={{ width }}>
            <LinearGradient
              colors={['#957DAD', '#fff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1, paddingTop: 150 }}
            >
              <View style={styles.slideContent}>
                <View style={styles.leftBox}>
                  <TouchableOpacity style={styles.button} onPress={() => 
                    router.push('/Activity/activity')}>
                    <Text style={styles.buttonText}>활동 둘러보기</Text>
                  </TouchableOpacity>

                  <Text style={styles.slideTitle}>단과대별 활동 한눈에 보기</Text>

                  <Text style={styles.sub}>
                    문과부터 SW융합, 음예대까지!{'\n'}
                    단과대별로 맞는 활동을 골라보세요
                  </Text>
                </View>

                <Image
                  source={require('@/assets/images/danspecLogo.png')}
                  style={styles.logo2}
                  resizeMode="contain"
                />
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
      </View>

      {/* 스크롤 가능한 부분: 활동 목록 */}
      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
      {/* 오늘의 미션 */}
      <Text style={styles.title}>오늘의 맞춤미션</Text> 
      <View style={styles.missionContainer}>
        {aiMission ? (
          <Text style={styles.missionText}>{aiMission}</Text>
        ) : (
          <Text style={styles.missionText}>미션을 불러오는 중...</Text>
        )}
      </View>
      <Text style={styles.title}>{userName}님을 위한 맞춤활동 </Text> 
      {/*api 연결 후 맞춤형 리스트로 변경*/}
      <View style={styles.activitiesContainer}>
        {loadingActivities ? (
          <Text style={styles.emptyStateText}>로딩중...</Text>
        ) : activities.length === 0 ? (
          <Text style={styles.emptyStateText}>모집중인 글이 없습니다</Text>
        ) : (
          activities.map((activity, index) => (
            <ActivityApplyBox
              key={activity.id || index}
              event={activity}
              tag={activity.category}
              title={activity.title}
              summarizedDescription={activity.summarizedDescription || activity.description}
              dueDate={activity.dueDate}
              startDate={activity.startDate}
              endDate={activity.endDate}
            />
          ))
        )}
      </View>
      </ScrollView>

      {/* 플로팅 버튼 */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => {
          // 버튼 클릭 시 동작 (필요시 수정)
          console.log('플로팅 버튼 클릭');
          router.push('/Home/chat');
        }}
      >
        <Image source={require('@/assets/images/dreame1.png')} style={styles.floatingButtonImage} />
        <Text style={styles.floatingButtonText}>챗봇</Text>
      </TouchableOpacity>

      <NaviBar currentPage="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  missionContainer: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  missionText: {
    fontSize: 15,
    fontFamily: 'Pretendard-Regular',
    color: '#000',
    lineHeight: 22,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flex: 1,
    marginBottom: 70,
    marginTop: 340,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  imageContainer: {
    height: 330,
    backgroundColor: '#F0F0F0',
  },
  slideContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leftBox: {
    flex: 1,
    gap: 16,
  },
  button: {
    marginLeft:20,
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Pretendard-Regular',
  },
  slideTitle: {
    marginLeft:20,
    fontSize: 22,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
  },
  sub: {
    marginLeft:20,
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#000',
    lineHeight: 20,
  },
  logo1: {
    width: 150,
    height: 150,
    marginLeft: 10,
    marginRight: 10,
    opacity: 0.8
  },
  logo2: {
    width: 100,
    height: 100,
    marginLeft: 30,
    marginRight: 20,
    opacity: 0.4
  },
  title: {
    fontSize: 22,
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 10,
    marginLeft: 20,
    paddingTop: 10,
    color: '#000',
    textAlign: 'left',
  },
  activitiesContainer: {
    marginTop: 14,
    paddingBottom: 20,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 130,
    width: 56,
    height: 56,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#4D90CC',
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
    gap: 2,
  },
  floatingButtonImage: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  floatingButtonText: {
    color: '#4D90CC',
    fontSize: 10,
    fontFamily: 'Pretendard-SemiBold',
  },
});
