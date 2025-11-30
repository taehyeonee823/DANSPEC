import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';


export default function activityApplyBox({ event, tag, title, summarizedDescription, dueDate }) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: './activityInfo',
      params: {
        eventData: JSON.stringify(event)
      }
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <Text style={styles.tag}>{tag}</Text>
        <Text style={styles.dueDate}>{dueDate}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.summarizedDescription}>{summarizedDescription}</Text>
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
  tag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3E64F4',
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
  summarizedDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});