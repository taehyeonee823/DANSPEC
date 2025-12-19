import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function teamApplyBox2({ dueDate, title, description, tag, onPress }) {
  // '상태: XXX' 형태를 파싱해서 상태 뱃지 텍스트 결정
  let statusBadgeText = null;
  let statusBadgeStyle = styles.statusPending;

  if (typeof tag === 'string' && tag.trim()) {
    const match = /^상태\s*:\s*(.+)$/i.exec(tag.trim());
    const raw = match ? match[1].trim() : '';
    const upper = raw.toUpperCase();

    if (upper === 'APPROVED' || upper === 'ACCEPTED' || raw === '승인' || raw === '승인됨') {
      statusBadgeText = '승인';
      statusBadgeStyle = styles.statusApproved;
    } else if (upper === 'REJECTED' || upper === 'DENIED' || raw === '거절' || raw === '거절됨') {
      statusBadgeText = '거절';
      statusBadgeStyle = styles.statusRejected;
    } else {
      // pending / 기타
      statusBadgeText = '대기';
      statusBadgeStyle = styles.statusPending;
    }
  } else {
    statusBadgeText = '대기';
    statusBadgeStyle = styles.statusPending;
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          {statusBadgeText && (
            <Text style={statusBadgeStyle}>{statusBadgeText}</Text>
          )}
        </View>
        <Text style={styles.dueDate}>작성일 {dueDate}</Text>
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
    color: '#FF8D28',
    backgroundColor: '#FFDE0A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  statusApproved: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#166534',
    backgroundColor: '#DCFCE6',
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