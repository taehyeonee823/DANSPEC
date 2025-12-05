import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function RecruitmentCard({ id, status, dueDate, title, capacity }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push('/My/applyCheck')}
    >
        
      <View style={styles.header}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <Text style={styles.dueDate}>{dueDate}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={[styles.footer, { flexDirection: 'row', alignItems: 'center' }]}>
        <Image
            source={require('../../assets/images/users.svg')}
            style={{ width: 15, height: 15 ,marginRight: 10}}
        />
        <Text style={styles.capacity}>(capacity) / {capacity}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#A2B4F4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: '#E2FBE7',
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    color: '#306339',
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    fontWeight: '600',
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
    paddingTop: 12,
  },
  capacity: {
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
  },
});
