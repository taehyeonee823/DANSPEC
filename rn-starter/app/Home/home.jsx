import React, { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
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
  const scrollViewRef = useRef(null);

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
    const loadActivities = async () => {
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

          // data가 배열인지 확인
          const activitiesArray = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);

          // 각 카테고리에서 하나씩 선택
          const categories = ['CONTEST', 'EXTERNAL', 'SCHOOL'];
          const selectedActivities = [];

          categories.forEach(category => {
            const activityInCategory = activitiesArray.find(activity => activity.category === category);
            if (activityInCategory) {
              selectedActivities.push(activityInCategory);
            }
          });

          setActivities(selectedActivities);
        }
      } catch (error) {
        console.error('활동 데이터 불러오기 실패:', error);
      }
    };
    loadActivities();
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
      <Text style={styles.title}>{userName} 님을 위한 맞춤활동 </Text> 
      </View>

      {/* 스크롤 가능한 부분: 활동 목록 */}
      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
      {/*api 연결 후 맞춤형 리스트로 변경*/}
      <View style={styles.activitiesContainer}>
        {activities.map((activity, index) => (
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
        ))}
      </View>
      </ScrollView>

      <NaviBar currentPage="home" />
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
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flex: 1,
    marginBottom: 70,
    marginTop: 390,
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
    fontSize: 24,
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 10,
    marginLeft: 20,
    paddingTop: 10,
    color: '#000',
    textAlign: 'left',
  },
  activitiesContainer: {
    marginTop: 16,
    paddingBottom: 20,
  },
});
