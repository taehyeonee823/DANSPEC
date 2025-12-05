import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Image, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ActivityInfo() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

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
              <Image
                source={{ uri: eventData.imageUrl }}
                style={styles.eventImage}
                resizeMode="contain"
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
                activityTitle: eventData.title
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
            <Text style={styles.headerTitle}>이 활동으로 모집중인 팀</Text>
          </View>

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
});
