import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import NaviBar from '../naviBar';
import CategoryChips from '@/components/CategoryChips';
import TeamApplyBox from './teamApplyBox';
import teamData from './teamApplyBoxDemo.json';
import CategoryTab from './categoryTab';

export default function Team() {
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(0); // 0: 모든 모집글, 1: 내가 쓴 모집글, 2: 내가 쓴 지원글

  // TODO: 외부 API 연결 예정
  const displayedTeams = [...teamData].sort((a, b) => {
    // "상시 모집"은 최상단에 위치
    if (a.dueDate === "상시 모집") return -1;
    if (b.dueDate === "상시 모집") return 1;

    // 마감 여부 계산 (오늘 이전 날짜는 마감)
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const aDate = new Date(a.dueDate);
    const bDate = new Date(b.dueDate);
    const aIsClosed = !isNaN(aDate) && aDate < todayStart;
    const bIsClosed = !isNaN(bDate) && bDate < todayStart;

    // 마감된 항목은 최하단으로
    if (aIsClosed && !bIsClosed) return 1;
    if (!aIsClosed && bIsClosed) return -1;

    // 모집 중이면 dueDate 빠른 순 (오름차순)
    // 마감이면 dueDate 늦은 순 (내림차순, 현재 날짜에 가까운 것이 위)
    if (aIsClosed && bIsClosed) {
      return bDate - aDate; // 내림차순
    } else {
      return aDate - bDate; // 오름차순
    }
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 105,
          backgroundColor: '#ffffff',
          zIndex: 998,
        }}
      />
      <TouchableOpacity
        style={{ position: 'absolute', top: 60, left: 30, zIndex: 1000 }}
        onPress={() => router.push('/Home/home')}
      >
        <Image
          source={require('../../assets/images/danspecLogo.png')}
          style={{ width: 35, height: 35 }}
          contentFit="contain"
        />
      </TouchableOpacity>

      <View style={styles.fixedHeader}>
        <CategoryTab activeIndex={activeTabIndex} onChangeIndex={setActiveTabIndex} />
      </View>

      <ScrollView style={styles.contentArea} contentContainerStyle={styles.scrollContent}>
        {activeTabIndex === 0 && displayedTeams.map((team) => {
          const isMine = team.manager === "지은";
          const navigateToModify = () =>
            router.push(`/Team/teamInfoModify?id=${team.id}&title=${encodeURIComponent(team.title)}`);
          return (
            <TeamApplyBox
              key={team.id}
              status={team.status}
              dueDate={team.dueDate}
              title={team.title}
              description={team.description}
              tag={`연결된 활동: ${team.tag}`}
              onPress={isMine ? navigateToModify : undefined}
            />
          );
        })}
        {activeTabIndex === 1 && displayedTeams
          .filter((team) => team.manager === "지은")
          .map((team) => (
            <TeamApplyBox
              key={team.id}
              status={team.status}
              dueDate={team.dueDate}
              title={team.title}
              description={team.description}
              tag={`연결된 활동: ${team.tag}`}
              onPress={() => router.push(`/Team/teamInfoModify?id=${team.id}&title=${encodeURIComponent(team.title)}`)}
            />
          ))}
      </ScrollView>
      <NaviBar currentPage="team" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: '#FFFFFF',
    zIndex: 998,
  },
  fixedHeader: {
    position: 'absolute',
    top: 35,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 999,
  },
  contentArea: {
    flex: 1,
    marginTop: 160,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 80,
    marginLeft: 20,
    marginBottom: 20,
    paddingTop: 10,
    color: '#000',
    textAlign: 'left',
  },
});