import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function teamApplyBox({ dueDate, title, description, tag, onPress }) {
  const router = useRouter();

  // status 계산 로직
  let status = '팀 모집 중';
  if (dueDate === '상시 모집') {
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

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.push('/Team/teamInfo');
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <Text style={statusStyle}>{status}</Text>
        <Text style={styles.dueDate}>{dueDate}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.tag}>{tag}</Text>
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
  status: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#166534',
    backgroundColor: '#DCFCE6',
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