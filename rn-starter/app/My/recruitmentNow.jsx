import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RecruitmentCard from './recruitmentCard';
import teamData from '../Team/teamApplyBoxDemo.json';
import AlarmTab from './alarmTab';

export default function RecruitmentNow() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // 팀을 상태별로 필터링
  const activeTeams = teamData.filter(team => team.status !== "마감");
  const closedTeams = teamData.filter(team => team.status === "마감");

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/My/my')}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>
          수신함
        </Text>
      </View>

      <View style={styles.fixedAlarmTab}>
        <AlarmTab />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>현재 모집중</Text>
        </View>

        {activeTeams.map((team) => (
          <RecruitmentCard
            key={team.id}
            {...team}
          />
        ))}

         <View style={styles.titleContainer}>
          <Text style={styles.title}>마감</Text>
        </View>

        {closedTeams.map((team) => (
          <RecruitmentCard
            key={team.id}
            {...team}
          />
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  headerBar: {
    height: 44, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 8,
    position: 'absolute', 
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 28,
    color: '#000',
    fontWeight: 'bold',
  },
  screenTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    textAlign: 'center',
  },
  fixedAlarmTab: {
    backgroundColor: '#FFFFFF',
    zIndex: 10, 
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    textAlign: 'left',
  },
});