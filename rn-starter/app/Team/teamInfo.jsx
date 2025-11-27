import React from "react";
import { Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from 'expo-router';
import Button from '../../components/Button';
import MultiplelineInput from '../../components/MultiplelineInput';
import SinglelineInput from '../../components/SinglelineInput';
import teamInfoData from '../teamInfo.json'; 

export default function Index() {
  const router = useRouter();

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

        <KeyboardAvoidingView behavior="height" style={{ flex: 1, marginTop: 110 }}>
          
          <ScrollView style={styles.container}
              contentContainerStyle={styles.contentContainer}>
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
        paddingBottom: 50,
        zIndex: 900
    },
    // **새로운 스타일 추가: 팀 정보 박스**
    teamInfoBox: {
        marginHorizontal: 20,
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f9f9f9', // 배경색 변경
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    status: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
    },
    dueDate: {
        fontSize: 14,
        color: '#666',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    tag: {
        fontSize: 12,
        color: '#999',
        marginBottom: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
    },
    details: {
        flexDirection: 'column',
    },
    detailText: {
        fontSize: 14,
        color: '#444',
        marginBottom: 3,
    },
    // 기존 스타일 유지
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
        marginTop: 15,
    },
    readOnlyText: {
        fontSize: 16,
        color: '#666',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 10,
    },
});