import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import NaviBar from '../naviBar';
import CategoryChips from '@/components/CategoryChips';
import { ThemedText } from '@/components/themed-text';
import { ScrollView } from 'react-native-gesture-handler';
import TeamApplyBox from '../Team/teamApplyBox';
import teamData from '../teamApplyBoxDemo.json';

export default function Team() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const categories = ["전체", "공모전", "대외 활동", "교내", "자율 프로젝트"];

  return (
    <View style={styles.container}>     
      <ScrollView style={styles.contentArea}>  
        <ThemedText style={styles.title}>이곳은 활동 화면 입니다.</ThemedText>

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
    paddingLeft: 15,
  },
  chipScrollViewContent: {
    paddingRight: 30,
  },
});