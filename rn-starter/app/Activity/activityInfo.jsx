import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Dimensions,Image, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { API_ENDPOINTS } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ActivityInfo() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const width = Dimensions.get('window').width;

  let eventData = params.eventData ? JSON.parse(params.eventData) : null;

  // recommendedTargets가 문자열로 저장되어 있으면 파싱
  if (eventData && eventData.recommendedTargets && typeof eventData.recommendedTargets === 'string') {
    try {
      eventData.recommendedTargets = JSON.parse(eventData.recommendedTargets);
    } 
    catch (e) {
      console.log('recommendedTargets 파싱 실패:', e);
    }
  }
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [myTeamIds, setMyTeamIds] = useState([]);

  const fetchTeams = useCallback(async () => {
    if (!eventData?.id) {
      console.log('eventData.id가 없습니다:', eventData);
      setLoadingTeams(false);
      return;
    }
    
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const url = API_ENDPOINTS.GET_TEAMS({ eventId: eventData.id });
      console.log('=== 팀 목록 조회 ===');
      console.log('요청 URL:', url);
      console.log('eventData.id:', eventData.id);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('응답 상태:', response.status);
      const data = await response.json();
      console.log('응답 데이터:', JSON.stringify(data, null, 2));
      
      // 응답이 배열이면 그대로, 객체 안에 배열이 있으면 추출
      let teamList = [];
      if (Array.isArray(data)) {
        teamList = data;
      } else if (data && Array.isArray(data.data)) {
        teamList = data.data;
      } else if (data && Array.isArray(data.teams)) {
        teamList = data.teams;
      } else if (data && Array.isArray(data.content)) {
        teamList = data.content;
      }
      
      setTeams(teamList);
    } catch (error) {
      console.error('팀 목록 불러오기 실패:', error);
      setTeams([]);
    } finally {
      setLoadingTeams(false);
    }
  }, [eventData?.id]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    const fetchUserInfoAndMyTeams = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return;

        // 사용자 정보 가져오기
        const userResponse = await fetch(API_ENDPOINTS.USER_ME, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (userResponse.ok) {
          const data = await userResponse.json();
          const user = data.success && data.data ? data.data : data;
          setUserInfo(user);
        }

        // 내가 작성한 팀 목록 가져오기
        const myTeamsUrl = API_ENDPOINTS.GET_TEAMS({ myPosts: true });
        const myTeamsResponse = await fetch(myTeamsUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (myTeamsResponse.ok) {
          const myTeamsData = await myTeamsResponse.json();
          let myTeamsList = [];

          if (Array.isArray(myTeamsData)) {
            myTeamsList = myTeamsData;
          } else if (myTeamsData && Array.isArray(myTeamsData.data)) {
            myTeamsList = myTeamsData.data;
          } else if (myTeamsData && Array.isArray(myTeamsData.teams)) {
            myTeamsList = myTeamsData.teams;
          } else if (myTeamsData && Array.isArray(myTeamsData.content)) {
            myTeamsList = myTeamsData.content;
          }

          const myIds = myTeamsList.map(team => team.id);
          setMyTeamIds(myIds);
        }
      } catch (error) {
        console.error('사용자 정보 및 팀 목록 불러오기 실패:', error);
      }
    };

    fetchUserInfoAndMyTeams();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTeams();
    }, [fetchTeams])
  );

  // 내가 모집중인 팀인지 확인
  const isMyTeam = (team) => {
    if (!team) return false;
    return myTeamIds.includes(team.id);
  };

  // 카테고리 한글 변환
  const getCategoryName = (category) => {
    const categoryMap = {
      'CONTEST': '공모전',
      'EXTERNAL': '대외 활동',
      'SCHOOL': '교내'
    };
    return categoryMap[category] || category;
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

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  if (!eventData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.errorText}>이벤트 정보를 불러올 수 없습니다.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>활동 정보</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>

          {/* 제목 */}
          <Text style={styles.title}>{eventData.title}</Text>

          {/* 요약 설명 */}
          {eventData.summarizedDescription && (
            <View style={styles.section}>
              <Text style={styles.description}>{eventData.summarizedDescription}</Text>
            </View>
          )}

          {/* 기간 및 마감일 박스 */}
          <View style={styles.dateBox}>
            <View style={styles.dateBoxRow}>
              <Image
                source={require('@/assets/images/calander.png')}
                style={styles.dateIcon}
              />
              <View style={styles.dateTextContainer}>
                <Text style={styles.dateBoxLabel}>기간</Text>
                <Text style={styles.dateBoxValue}>
                  {formatDate(eventData.startDate)} - {formatDate(eventData.endDate)}
                </Text>
              </View>
            </View>
            <View style={styles.dateBoxVerticalDivider} />
            <View style={styles.dateBoxRow}>
              <Image
                source={require('@/assets/images/clock.png')}
                style={styles.dateIcon}
              />
              <View style={styles.dateTextContainer}>
                <Text style={styles.dateBoxLabel}>마감일</Text>
                <Text style={styles.dateBoxValue}>{calculateDueDate(eventData.endDate)}</Text>
              </View>
            </View>
          </View>

          {/* 이미지 */}
          {eventData.imageUrl && (
            <View style={styles.imageSection}>
              <AutoHeightImage
                source={{ uri: eventData.imageUrl }}
                width={width - 40}
              />
            </View>
          )}

          {/* 드림이 Tip */}
          {eventData.recommendedTargets && Array.isArray(eventData.recommendedTargets) && eventData.recommendedTargets.length > 0 && (
            <View style={styles.tipBox}>
              <Image
                source={require('@/assets/images/dreame.png')}
                style={styles.dreameIcon}
              />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>드림이 Tip</Text>
                <Text style={styles.tipSubtitle}>이런 학생에게 추천해요!</Text>
                <View style={styles.targetList}>
                  {eventData.recommendedTargets.map((target, index) => (
                    <Text key={index} style={styles.targetItem}>• {target}</Text>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* 상세페이지 URL */}
          {eventData.detailUrl && (
            <TouchableOpacity
              style={styles.buttonBox}
              onPress={() => Linking.openURL(eventData.detailUrl)}
            >
              <Text style={styles.buttonText}>상세 페이지 보기</Text>
            </TouchableOpacity>
          )}

          {/* 이 활동으로 팀 만들기 */}
          <TouchableOpacity
            style={styles.primaryButtonBox}
            onPress={() => router.push({
              pathname: '/Team/teamRecruitmentForm',
              params: {
                activityTitle: eventData.title,
                eventId: eventData.id
              }
            })}
          >
            <Text style={styles.primaryButtonText}>이 활동으로 팀 만들기</Text>
          </TouchableOpacity>

          <View style={styles.sectionWithIcon}>
            <Image
              source={require('@/assets/images/pin.png')}
              style={styles.pinIcon}
            />
            <Text style={styles.headerTitle}>이 활동으로 모집 중인 팀</Text>
          </View>

          {/* 팀 카드 목록 */}
          {loadingTeams ? (
            <Text style={styles.loadingText}>팀 목록을 불러오는 중...</Text>
          ) : teams.length === 0 ? (
            <Text style={styles.emptyText}>아직 모집 중인 팀이 없습니다.</Text>
          ) : (
            teams.map((team) => (
              <TouchableOpacity
                key={team.id}
                style={styles.teamCard}
                onPress={async () => {
                  try {
                    const token = await AsyncStorage.getItem('accessToken');
                    const teamIdNum = Number(team.id);

                    // 토큰이 없거나 teamId가 비정상이면 기존 분기 로직으로 fallback
                    if (!token || Number.isNaN(teamIdNum)) {
                      if (isMyTeam(team)) {
                        router.push({
                          pathname: '/Team/teamInfo',
                          params: {
                            teamId: team.id,
                            isMyTeam: 'true'
                          }
                        });
                      } else {
                        router.push({
                          pathname: '/Team/teamInfo2',
                          params: {
                            teamId: team.id,
                            teamData: JSON.stringify(team)
                          }
                        });
                      }
                      return;
                    }

                    const res = await fetch(API_ENDPOINTS.GET_TEAM_DETAIL(teamIdNum), {
                      method: 'GET',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                      },
                    });

                    if (!res.ok) {
                      // 실패 시 기존 분기 로직
                      if (isMyTeam(team)) {
                        router.push({
                          pathname: '/Team/teamInfo',
                          params: {
                            teamId: team.id,
                            isMyTeam: 'true'
                          }
                        });
                      } else {
                        router.push({
                          pathname: '/Team/teamInfo2',
                          params: {
                            teamId: team.id,
                            teamData: JSON.stringify(team)
                          }
                        });
                      }
                      return;
                    }

                    const json = await res.json();
                    const teamDetail = (json && json.success && json.data) ? json.data : json;

                    const isLeader = !!teamDetail?.leader;
                    const hasApplied = !!teamDetail?.hasApplied;

                    if (isLeader) {
                      router.push({
                        pathname: '/Team/teamInfo',
                        params: { teamId: teamIdNum, isMyTeam: 'true' },
                      });
                    } else {
                      router.push({
                        pathname: '/Team/teamInfo2',
                        params: {
                          teamId: teamIdNum,
                          // 기존 화면에서 활용할 수 있게 전달
                          hasApplied: hasApplied ? 'true' : 'false',
                          teamData: JSON.stringify(team),
                        },
                      });
                    }
                  } catch (e) {
                    // 예외 시 기존 분기 로직
                    if (isMyTeam(team)) {
                      router.push({
                        pathname: '/Team/teamInfo',
                        params: {
                          teamId: team.id,
                          isMyTeam: 'true'
                        }
                      });
                    } else {
                      router.push({
                        pathname: '/Team/teamInfo2',
                        params: {
                          teamId: team.id,
                          teamData: JSON.stringify(team)
                        }
                      });
                    }
                  }
                }}
              >
                {isMyTeam(team) && (
                  <View style={styles.myTeamBadge}>
                    <Text style={styles.myTeamBadgeText}>내가 모집중인 팀</Text>
                  </View>
                )}
                <Text style={styles.teamCardTitle}>{team.title}</Text>
                <Text style={styles.teamCardTag}>{team.promotionText}</Text>
                <Text style={styles.teamCardTag}>
                  {`현재 인원: ${team.currentMemberCount ?? team.currentMember ?? 0} / ${team.capacity ?? '-'}`}
                </Text>
              </TouchableOpacity>
            ))
          )}

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
    width: 44,
  },
  backIcon: {
    fontSize: 28,
    color: '#000',
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
  },
  headerRight: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Pretendard-Bold',
    color: '#000',
    marginBottom: 24,
    lineHeight: 30,
  },
  section: {
    marginBottom: 24,
  },
  dateBox: {
    borderWidth: 2,
    borderColor: '#DAE1FB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#F8FAFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateIcon: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateBoxLabel: {
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
    color: '#666',
    marginBottom: 2,
  },
  dateBoxValue: {
    fontSize: 13,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    marginTop: 3,
  },
  dateBoxVerticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 12,
  },
  imageSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  eventImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  tipBox: {
    borderWidth: 2,
    borderColor: '#DAE1FB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#F8FAFF',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dreameIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    color: '#000',
    marginBottom: 8,
  },
  tipSubtitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  targetList: {
    marginTop: 4,
  },
  targetItem: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: '#000',
    lineHeight: 22,
    marginBottom: 4,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
  },
  expandIcon: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 16,
    color: '#000',
    lineHeight: 25,
  },
  urlText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: '#000',
    textDecorationLine: 'underline',
    marginBottom: 16,
  },
  buttonBox: {
    borderWidth: 2,
    borderColor: '#DAE1FB',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#F8FAFF',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
  },
  primaryButtonBox: {
    borderWidth: 0,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#4869EC',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#FFFFFF',
  },
  sectionWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  pinIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#000',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
  teamCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  myTeamBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#34C759',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  myTeamBadgeText: {
    fontSize: 11,
    fontFamily: 'Pretendard-SemiBold',
    color: '#FFFFFF',
  },
  teamCardTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    marginBottom: 5,
  },
  teamCardTag: {
    fontSize: 13,
    fontFamily: 'Pretendard-regular',
    color: '#000',
    marginBottom: 3,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

const AutoHeightImage = ({ source, width, style }) => {
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (source?.uri) {
      // 웹 이미지(URL) 크기 계산
      Image.getSize(source.uri, (w, h) => {
        setHeight(h * (width / w));
      });
    } else {
      // 로컬 파일 크기 계산
      const { width: w, height: h } = Image.resolveAssetSource(source);
      setHeight(h * (width / w));
    }
  }, [source, width]);

  return (
    <Image
      source={source}
      style={[style, { width: width, height: height }]}
      resizeMode="contain"
    />
  );
};