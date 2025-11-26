import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import NaviBar from './naviBar';
import CategoryChips from '../components/CategoryChips';
import { ThemedText } from '@/components/themed-text';
import { ScrollView } from 'react-native-gesture-handler';
import TeamApplyBox from './teamApplyBox';
import teamData from './teamApplyBoxDemo.json';

export default function Team() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("모든 모집글");
  const categories = ["모든 모집글", "내가 쓴 모집글만"];

  return (
    <View style={styles.container}>     
      <ScrollView style={styles.contentArea}>  
        <ThemedText style={styles.title}>이곳은 팀 화면 입니다.</ThemedText>

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

        {teamData.map((team) => (
          <TeamApplyBox
            key={team.id}
            status={team.status}
            dueDate={team.dueDate}
            title={team.title}
            description={team.description}
            tag={team.tag}
          />
        ))}
      </ScrollView>
      
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push('/TeamRecruitmentForm')}
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
  contentArea: {
    flex: 1, 
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