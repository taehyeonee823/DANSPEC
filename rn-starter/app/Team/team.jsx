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
  const [selectedCategory, setSelectedCategory] = useState("모든 모집글");
  const categories = ["모든 모집글", "내가 쓴 모집글만", "내가 쓴 지원글만"];

  // TODO: 외부 API 연결 예정
  const displayedTeams = teamData;

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
        <CategoryTab />
      </View>

      <ScrollView style={styles.contentArea} contentContainerStyle={styles.scrollContent}>
        {displayedTeams.map((team) => (
          <TeamApplyBox
            key={team.id}
            status={team.status}
            dueDate={team.dueDate}
            title={team.title}
            description={team.description}
            tag={`연결된 활동: ${team.tag}`}
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