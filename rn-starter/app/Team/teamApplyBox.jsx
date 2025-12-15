import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function teamApplyBox({ dueDate, title, description, tag, onPress, recruiting, currentMemberCount, capacity }) {
  // status 계산 로직
  let status = '팀 모집 중';

  // recruiting prop이 있으면 우선 사용
  if (recruiting === false) {
    status = '마감';
  } else if (capacity && currentMemberCount >= capacity) {
    // 정원이 찬 경우
    status = '마감';
  } else if (dueDate === '상시 모집') {
    status = '팀 모집 중';
  } else {
    const today = new Date();
    const due = new Date(dueDate);
    // dueDate가 오늘 이전이면 '마감'
    if (!isNaN(due) && due < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      status = '마감';
    }
  }

  const isClosed = status === '마감';
  const statusStyle = [
    styles.status,
    isClosed && {
      backgroundColor: '#F9CBCB',
      color: '#F00',
    },
  ];

  // '상태: XXX' 형태를 뱃지로 분리해서 노출
  const extraBadgeRaw = typeof tag === 'string' && tag.startsWith('상태:') ? tag.replace('상태:', '').trim() : null;
  const statusKoMap = {
    REJECTED: '거절',
    APPROVED: '승인',
    PENDING: '대기',
  };
  const extraBadgeText = extraBadgeRaw ? (statusKoMap[extraBadgeRaw] ?? extraBadgeRaw) : null;

  // 상태 뱃지: 배경은 통일(#555), 텍스트 색만 상태별로 변경
  const statusTextColorMap = {
    REJECTED: '#FF3B30',
    APPROVED: '#301386',
    PENDING: '#000',
  };

  const extraBadgeStyle = [
    styles.extraBadge,
    { backgroundColor: '#F0F0F0' },
    extraBadgeRaw && statusTextColorMap[extraBadgeRaw] ? { color: statusTextColorMap[extraBadgeRaw] } : null,
  ];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Text style={statusStyle}>{status}</Text>
          {extraBadgeText ? (
            <Text style={extraBadgeStyle}>{extraBadgeText}</Text>
          ) : null}
        </View>
        <View style={styles.memberCountContainer}>
          <Image
            source={require('../../assets/images/users.svg')}
            style={styles.usersIcon}
            contentFit="contain"
          />
          <Text style={styles.memberCount}>
            {currentMemberCount} / {capacity}
          </Text>
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {!extraBadgeText ? <Text style={styles.tag}>{tag}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  status: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#166534',
    backgroundColor: '#DCFCE6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  extraBadge: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    // 기본 텍스트 색(상태값이 없거나 매핑이 없을 때)
    color: '#301386',
    // 배경은 상단에서 #555로 통일해서 덮어씀
    backgroundColor: '#555',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  memberCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  usersIcon: {
    width: 16,
    height: 16,
    marginRight: 4
  },
  memberCount: {
    fontSize: 12,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  tag: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#3E6AF4',
  },
});