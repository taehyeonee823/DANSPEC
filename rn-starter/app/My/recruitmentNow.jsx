import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NaviBar from '../naviBar';
import RecruitmentCard from './recruitmentCard';
import ApplyResultCard from './applyResult';
import teamData from '../Team/teamApplyBoxDemo.json';
import AlarmTab from './alarmTab';

export default function RecruitmentNow() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = React.useState(0);

  // 알림 데모 데이터 (실제로는 백엔드 서버에서 받아와야 함)
  const notificationData = [
    { id: 1, type: 'accepted', teamName: '[데분캠프] 데이터 분석 1팀', timeAgo: '5분 전' },
    { id: 2, type: 'rejected', teamName: '[데분캠프] 데이터 분석 2팀', timeAgo: '30분 전' },
  ];

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>
          수신함
        </Text>
      </View>

      <View style={styles.fixedAlarmTab}>
        <AlarmTab onTabChange={setActiveTab} />
      </View>

      {activeTab === 0 && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >

          {notificationData.map((notification) => (
            <ApplyResultCard
              key={notification.id}
              {...notification}
            />
          ))}
        </ScrollView>
      )}

      {activeTab === 1 && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>현재 모집중</Text>
          </View>

          {teamData.map((team) => (
            <RecruitmentCard
              key={team.id}
              {...team}
            />
          ))}
        </ScrollView>
      )}

      <NaviBar currentPage="my" />
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
    fontWeight: '600',
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
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    textAlign: 'left',
  },
});