import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Image, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ActivityInfo() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const eventData = params.eventData ? JSON.parse(params.eventData) : null;

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

  // 기간 계산 (주 단위)
  const calculateWeeks = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.ceil(diffDays / 7);
    return `${weeks}주`;
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

          {/* 상세 설명 */}
          {eventData.description && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.expandableHeader}
                onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                <Text style={styles.sectionTitle}>상세 설명</Text>
                <Text style={styles.expandIcon}>
                  {isDescriptionExpanded ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>
              {isDescriptionExpanded && (
                <Text style={styles.description}>{eventData.description}</Text>
              )}
            </View>
          )}

          {/* 상세페이지 URL */}
          {eventData.detailUrl && (
            <View style={styles.section}>
              <TouchableOpacity onPress={() => Linking.openURL(eventData.detailUrl)}>
                <Text style={styles.urlText}>상세페이지로 가기</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 50,
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
    fontSize: 18,
    fontWeight: '600',
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
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
    lineHeight: 30,
  },
  section: {
    marginBottom: 24,
  },
  dateBox: {
    borderWidth: 2,
    borderColor: '#3E64F4',
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
    color: '#666',
    marginBottom: 2,
  },
  dateBoxValue: {
    fontSize: 13,
    fontWeight: '600',
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
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    color: '#000',
    textDecorationLine: 'underline',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});
