import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function teamApplyBox({ status, dueDate, title, description, tag }) {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push('/teamInfo')}>
      <View style={styles.header}>
        <Text style={styles.status}>{status}</Text>
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
    fontWeight: '600',
    color: 'green',
    backgroundColor: '#E8EFFF',
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
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  tag: {
    fontSize: 12,
    color: '#3E6AF4',
  },
});