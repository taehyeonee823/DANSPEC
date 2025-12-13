import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';


export default function activityApplyBox({ event, tag, title, summarizedDescription, dueDate, startDate, endDate, clickable = true }) {
  const router = useRouter();

  // 카테고리 한글 변환
  const getCategoryName = (category) => {
    const categoryMap = {
      'CONTEST': '공모전',
      'EXTERNAL': '대외 활동',
      'SCHOOL': '교내'
    };
    return categoryMap[category] || category;
  };

  const handlePress = () => {
    if (clickable) {
      router.push({
        pathname: '/Activity/activityInfo',
        params: {
          eventData: JSON.stringify(event)
        }
      });
    }
  };

  const CardContainer = clickable ? TouchableOpacity : View;

  return (
    <CardContainer
      style={styles.card}
      onPress={clickable ? handlePress : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.tag}>{getCategoryName(tag)}</Text>
        <Text style={styles.dueDate}>{dueDate}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.summarizedDescription}>{summarizedDescription}</Text>
      <View style={styles.dateTagWrapper}>
        <View style={styles.dateTag}>
        <Image
          source={require('@/assets/images/calendar.svg')}
          style={{ width: 18, height: 18, marginRight: 4 }}
          contentFit="contain"
          tintColor="#FFFFFF"
        />
        <Text style={styles.dateTagText}>{startDate} ~ {endDate}</Text>
        </View>
      </View>
    </CardContainer>
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
  dateTagWrapper: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  dateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: 'Pretendard-Medium',
    backgroundColor: '#3E64F4',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3E64F4',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dateTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
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