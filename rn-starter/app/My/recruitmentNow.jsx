import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NaviBar from '../naviBar';
import RecruitmentCard from './recruitmentCard';
import teamData from '../Team/teamApplyBoxDemo.json';
import AlarmTab from './alarmTab';

export default function RecruitmentNow() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = React.useState(0);

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

           <View style={styles.titleContainer}>
            <Text style={styles.title}>마감</Text>
          </View>

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