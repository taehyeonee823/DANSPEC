import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function RecruitmentCard({ id, status, dueDate, title, capacity }) {
  const router = useRouter();

  // 마감 여부에 따른 스타일 결정
  const isClosed = status === "마감";
  const badgeStyle = isClosed ? styles.statusBadgeClosed : styles.statusBadge;
  const textStyle = isClosed ? styles.statusTextClosed : styles.statusText;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        console.log('RecruitmentCard 클릭, teamId:', id, 'type:', typeof id);
        router.push({
          pathname: '/My/applyCheck',
          params: { teamId: String(id) }
        });
      }}
    >

      <View style={styles.header}>
        <View style={badgeStyle}>
          <Text style={textStyle}>{status}</Text>
        </View>
        <Text style={styles.dueDate}>{dueDate}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={[styles.footer, { flexDirection: 'row', alignItems: 'center' }]}>
        <Image
            source={require('../../assets/images/users.svg')}
            style={{ width: 15, height: 15 ,marginRight: 10}}
        />
        <Text style={styles.capacity}>{isClosed ? capacity : '?'} / {capacity}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#999',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    backgroundColor: '#E2FBE7',
    borderRadius: 12,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadgeClosed: {
    backgroundColor: '#F9CBCB',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  statusText: {
    color: '#306339',
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
  },
  statusTextClosed: {
    color: '#FF0000',
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
  },
  dueDate: {
    fontSize: 12,
    color: '#666',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    color: '#000',
    marginBottom: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
  },
  capacity: {
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
  },
});
