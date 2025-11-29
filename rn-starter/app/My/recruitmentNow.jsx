import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import NaviBar from '../naviBar';
import { ThemedText } from '@/components/themed-text';
import RecruitmentCard from './recruitmentCard';
import teamData from '../Team/teamApplyBoxDemo.json';

export default function RecruitmentNow() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150,
        backgroundColor: '#ffffff',
        zIndex: 998
      }} />

      <TouchableOpacity
        style={{ position: 'absolute', top: 60, left: 20, zIndex: 999, padding: 8 }}
        onPress={() => router.back()}
      >
        <Text style={{ fontSize: 28, color: '#000', fontWeight: 'bold' }}>←</Text>
      </TouchableOpacity>

      <View style={{ position: 'absolute', top: 95, left: 30, zIndex: 999 }}>
        <Text style={styles.title}>현재 모집중</Text>
      </View>

      <ScrollView style={styles.container}
        contentContainerStyle={styles.scrollViewContent}>

        {teamData.map((team) => (
          <RecruitmentCard
            key={team.id}
            {...team}
          />
        ))}
      </ScrollView>
      <NaviBar currentPage="my" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 140,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    paddingTop: 10,
    marginBottom: 20,
  },
});
