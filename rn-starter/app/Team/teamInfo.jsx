import React from "react";
import { Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import teamInfoData from './teamInfo.json'; 

export default function TeamInfo() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // teamInfo.json dummy data에서 팀장 정보 추출
  const teamLeaderTitle = teamInfoData[0].title;
  const teamLeaderTag = teamInfoData[0].tag;
  const teamLeaderDescription = teamInfoData[0].description;
  const teamLeaderName = teamInfoData[0].name; 
  const teamLeaderGrade = teamInfoData[0].grade;
  const teamLeaderDepartment = teamInfoData[0].department;
  const teamLeaderRole = teamInfoData[0].role.join(", ");
  const teamLeaderTrait = teamInfoData[0].trait;
  

  return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <TouchableOpacity
          style={{ position: 'absolute', top:60, left: 20, zIndex: 999, padding: 8 }}
          onPress={() => router.back()}
        >
          <Text style={{ fontSize: 28, color: '#000', fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView 
          behavior="height" 
          style={{ 
            flex: 1, 
            marginTop: 110,
            paddingBottom: insets.bottom
          }}>
          
          <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}>
            <Text style={styles.mainTitle}>{teamLeaderTitle}</Text>

            <Text style={styles.sectionTitle}>연결된 활동 / 공모전</Text>
            <Text style={styles.readOnlyText}>{teamLeaderTag}</Text>

            <Text style={styles.sectionTitle}>진행 방식 및 소개</Text>
            <Text style={styles.readOnlyText}>{teamLeaderDescription}</Text>

            <Text style={styles.sectionTitle}>이름</Text>
            <Text style={styles.readOnlyText}>{teamLeaderName}</Text>

            <Text style={styles.sectionTitle}>학과</Text>
            <Text style={styles.readOnlyText}>{teamLeaderDepartment}</Text>

            <Text style={styles.sectionTitle}>학년</Text>
            <Text style={styles.readOnlyText}>{teamLeaderGrade}</Text>

            <Text style={styles.sectionTitle}>역할</Text>
            <Text style={styles.readOnlyText}>{teamLeaderRole}</Text>

            <Text style={styles.sectionTitle}>특징</Text>
            <Text style={styles.readOnlyText}>{teamLeaderTrait}</Text>

            <Button
                title="지원하기"
                onPress={() => {
                    router.push('/Team/teamApplicationForm');
                }}
                style={{ marginTop: 20 }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // **스크롤뷰의 paddingHorizontal을 제거하고, 아래 contentContainer에서 관리**
        // paddingHorizontal: 20, 
        backgroundColor: '#ffffff',
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 20,
        zIndex: 900
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    // 기존 스타일 유지
    mainTitle: {
        fontSize: 20,
        fontFamily: 'Pretendard-SemiBold',
        color: '#1A1A1A',
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Pretendard-Medium',
        color: '#1A1A1A',
        marginBottom: 16,
        marginTop: 28,
    },
    readOnlyText: {
        fontSize: 16,
        color: '#666',
        paddingVertical: 8,
        paddingHorizontal: 8,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
});