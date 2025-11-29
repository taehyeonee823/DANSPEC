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
  const categories = ["모든 모집글", "내가 쓴 모집글만"];

  // TODO: 외부 API 연결 예정
  const displayedTeams = teamData;

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground} />
      <View style={styles.fixedHeader}>
        <CategoryTab />
        <View style={styles.chipsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScrollViewContent}
          >
            <CategoryChips
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </ScrollView>
        </View>
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

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push('/Team/teamRecruitmentForm')}
      >
        <Image
          source={require('@/assets/images/plusBotton.png')}
          style={styles.plusIcon}
        />
      </TouchableOpacity>

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
    height: 180,
    backgroundColor: '#FFFFFF',
    zIndex: 998,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 999,
  },
  contentArea: {
    flex: 1,
    marginTop: 210,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginLeft: 20,
    marginBottom: 20,
    paddingTop: 10,
    color: '#000',
    textAlign: 'left',
  },
  chipsWrapper: {
    paddingTop: 15,
    paddingLeft: 15,
  },
  chipScrollViewContent: {
    paddingRight: 30,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 110, 
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 999, 
  },
  plusIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});