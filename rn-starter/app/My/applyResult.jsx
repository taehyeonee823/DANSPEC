import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function ApplyResultCard({ id, type, teamName, timeAgo }) {
  const router = useRouter();

  const isAccepted = type === 'accepted';

  return (
    <TouchableOpacity
      style={[styles.card, isAccepted ? styles.acceptedCard : styles.rejectedCard]}
      onPress={() => router.push('/My/applyCheck')}
    >
      <View style={styles.header}>
        <View style={styles.contentContainer}>
          <Image
            source={isAccepted
              ? require('../../assets/images/accepted.svg')
              : require('../../assets/images/rejected.svg')
            }
            style={styles.icon}
          />

          <View style={styles.textContainer}>
            <Text style={styles.statusText}>
              {isAccepted ? '가입완료' : '가입거절'}
            </Text>

            <Text style={styles.message}>
              {isAccepted
                ? `${teamName} 모집 가입이 완료되었습니다.`
                : `${teamName} 모집 가입이 거절되었습니다.`
              }
            </Text>
          </View>
        </View>

        <Text style={styles.timeText}>{timeAgo}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 16,
    borderWidth: 2,
  },
  acceptedCard: {
    backgroundColor: '#fff',
    borderColor: '#4869EC',
  },
  rejectedCard: {
    backgroundColor: '#fff',
    borderColor: '#ff0000',
  },
  header: {
    position: 'relative',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeText: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 15,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    lineHeight: 22,
  },
});
