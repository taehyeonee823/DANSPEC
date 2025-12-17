import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Dimensions, Linking, Image as RNImage, Modal } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { API_ENDPOINTS } from '@/config/api';
import * as SecureStore from 'expo-secure-store';

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
  const [myTeams, setMyTeams] = useState([]);
  const [showAlreadyRecruitingModal, setShowAlreadyRecruitingModal] = useState(false);

  const fetchTeams = useCallback(async () => {
    if (!eventData?.id) {
      console.log('eventData.id가 없습니다:', eventData);
      setLoadingTeams(false);
      return;
    }
    
    try {
      const token = await SecureStore.getItemAsync('accessToken');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData?.id]);

  useEffect(() => {
    const fetchUserInfoAndMyTeams = async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
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
          setMyTeams(myTeamsList);
        }
      } catch (error) {
        console.error('사용자 정보 및 팀 목록 불러오기 실패:', error);
      }
    };

    fetchUserInfoAndMyTeams();
  }, []);

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
            onPress={() => {
              // 같은 활동으로 이미 모집중인 팀이 있는지 확인
              const hasSameActivityTeam = myTeams.some(team =>
                team.connectedActivityTitle === eventData.title
              );

              if (hasSameActivityTeam) {
                setShowAlreadyRecruitingModal(true);
              } else {
                router.push({
                  pathname: '/Team/teamRecruitmentForm',
                  params: {
                    activityTitle: eventData.title,
                    eventId: eventData.id
                  }
                });
              }
            }}
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
                onPress={() => {
                  // 화면 이동 전에 팀 상세 API 호출하지 않음
                  router.push({
                    pathname: '/Team/teamInfo2',
                    params: {
                      teamId: String(team.id),
                      teamData: JSON.stringify(team),
                    },
                  });
                }}
              >
                {isMyTeam(team) && (
                  <View style={styles.myTeamBadge}>
                    <Text style={styles.myTeamBadgeText}>내가 모집중인 팀</Text>
                  </View>
                )}
                <Text style={styles.teamCardTitle}>{team.title}</Text>
                <Text style={styles.teamCardTag}>{team.promotionText}</Text>
                <View style={styles.memberCountRow}>
                  <Image
                    source={require('@/assets/images/users.svg')}
                    style={styles.usersIcon}
                    contentFit="contain"
                  />
                  <Text style={styles.memberCountText}>
                    {`${team.currentMemberCount ?? team.currentMember ?? 0} / ${team.capacity ?? '-'}`}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}

        </View>
      </ScrollView>

      {/* 이미 모집중인 팀이 있을 때 모달 */}
      <Modal
        visible={showAlreadyRecruitingModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAlreadyRecruitingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image
              source={require('@/assets/images/alert.svg')}
              style={styles.alertIcon}
              contentFit="contain"
            />
            <Text style={styles.modalTitle}>이미 모집중인 팀이 있습니다.</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => setShowAlreadyRecruitingModal(false)}
              >
                <Text style={styles.confirmButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    borderWidth: 1,
    borderColor: '#3E6AF433',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
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
    borderWidth: 1,
    borderColor: '#3E6AF433',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
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
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
  },
  primaryButtonBox: {
    borderWidth: 0,
    borderRadius: 8,
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
    padding: 14,
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
    marginBottom: 5,
  },
  memberCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  usersIcon: {
    width: 16,
    height: 16,
  },
  memberCountText: {
    fontSize: 13,
    fontFamily: 'Pretendard-regular',
    color: '#000',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    alignItems: 'center',
  },
  alertIcon: {
    width: 48,
    height: 48,
    flexShrink: 0,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#000',
  },
});

const AutoHeightImage = ({ source, width, style }) => {
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (source?.uri) {
      // 웹 이미지(URL) 크기 계산
      RNImage.getSize(source.uri, (w, h) => {
        setHeight(h * (width / w));
      });
    } else {
      // 로컬 파일 크기 계산
      const { width: w, height: h } = RNImage.resolveAssetSource(source);
      setHeight(h * (width / w));
    }
  }, [source, width]);

  return (
    <RNImage
      source={source}
      style={[style, { width: width, height: height }]}
      resizeMode="contain"
    />
  );
};