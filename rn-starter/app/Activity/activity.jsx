import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import NaviBar from '../naviBar';
import CategoryChips from '@/components/CategoryChips';
import { ThemedText } from '@/components/themed-text';
import { ScrollView } from 'react-native-gesture-handler';
import ActivityApplyBox from './activityApplyBox';
import teamActivity from '../teamActivity.json';
import DeptTab from './deptTab';

export default function Activity() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const categories = ["전체", "공모전", "대외 활동", "교내", "자율 프로젝트"];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentArea}>
       <DeptTab />

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

        {teamActivity.map((team) => (
                  <ActivityApplyBox
                    key={team.id}
                    tag={team.tag}
                    dueDate={team.dueDate}
                    title={team.title}
                    description={team.description}
                  />
                ))}

      </ScrollView>
      
      <NaviBar currentPage="activity" />
      
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
    paddingTop: 15,
    paddingLeft: 15,
  },
  chipScrollViewContent: {
    paddingRight: 30,
  },
});