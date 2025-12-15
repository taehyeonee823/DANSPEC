import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function teamApplyBox2({ dueDate, title, description, tag, onPress }) {
  // '상태: XXX' 형태를 파싱해서 상태 뱃지 텍스트 결정
  let statusBadgeText = null;
  let statusBadgeStyle = styles.statusPending;
  let isRejected = false;
  
  if (typeof tag === 'string' && tag.trim()) {
    const match = /^상태\s*:\s*(.+)$/i.exec(tag.trim());
    if (match) {
      const statusValue = match[1].trim().toLowerCase();
      console.log('teamApplyBox2 tag:', tag, 'statusValue:', statusValue);
      
      if (statusValue === 'approved' || statusValue === 'accepted' || statusValue === '승인') {
        statusBadgeText = '승인';
        statusBadgeStyle = styles.statusApproved;
      } else if (statusValue === 'rejected' || statusValue === 'denied' || statusValue === '거절') {
        // 거절된 경우 렌더링하지 않음
        isRejected = true;
      } else {
        // pending / 기타 값은 모두 승인 대기
        statusBadgeText = '대기';
        statusBadgeStyle = styles.statusPending;
      }
    } else {
      // "상태:"로 시작하지 않으면 기본적으로 "승인 대기"로 표시
      console.log('teamApplyBox2 tag 파싱 실패, 기본값 사용:', tag);
      statusBadgeText = '승인 대기';
      statusBadgeStyle = styles.statusPending;
    }
  } else {
    // tag가 없거나 빈 값이면 기본적으로 "승인 대기"로 표시
    statusBadgeText = '승인 대기';
    statusBadgeStyle = styles.statusPending;
  }

  // 거절된 경우 렌더링하지 않음
  if (isRejected) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          {statusBadgeText && (
            <Text style={statusBadgeStyle}>{statusBadgeText}</Text>
          )}
        </View>
        <Text style={styles.dueDate}>{dueDate}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {statusBadgeText ? null : <Text style={styles.tag}>{tag}</Text>}
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
  statusPending: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#FFFFFF',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  statusApproved: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#FFFFFF',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  statusRejected: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#FFFFFF',
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  dueDate: {
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