import React from "react";
import { Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity } from "react-native";
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Button from '../../components/Button';
import MultilineInput from '../../components/MultiplelineInput';
import teamInfoData from './teamInfo.json'; // TODO: API 연동 시 상세 조회 API로 교체

export default function TeamInfo() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // TODO: API 연동 시
  // - params.id를 받아서 상세 조회 API 호출
  // - 로딩/에러 상태 관리 후 team 데이터 주입
  // - 아래 fallback(find) 로직은 서버 데이터 수신 이후 필요 없을 수 있음
  // 선택된 팀 정보 조회 (기본값: 첫 번째)
  const teamId = params.id ? Number(params.id) : teamInfoData[0]?.id;
  const teamTitleParam = params.title;
  const team =
    teamInfoData.find((item) => item.id === teamId) ||
    (teamTitleParam ? teamInfoData.find((item) => item.title === teamTitleParam) : undefined) ||
    teamInfoData[0];
  const teamLeaderTitle = team?.title;
  const teamLeaderTag = team?.tag;
  const teamLeaderDescription = team?.description;
  const teamLeaderName = team?.name; 
  const teamLeaderGrade = team?.grade;
  const teamLeaderCollege = team?.college;
  const teamLeaderMajor = team?.major;
  const teamLeaderRole = team?.role?.join(", ");
  const teamLeaderTrait = team?.trait;
  

  return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <TouchableOpacity
          style={{ position: 'absolute', top:60, left: 8, zIndex: 999, padding: 8 }}
          onPress={() => router.back()}
        >
          <Image
            source={require('@/assets/images/left.svg')}
            style={{ width: 30, height: 30 }}
            contentFit="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ position: 'absolute', top:60, right: 20, zIndex: 999, padding: 8 }}
          onPress={() => router.push('/Team/teamRecruitmentFormModify')}
        >
          <Text style={{ fontSize: 18, color: '#000', fontFamily: 'Pretendard-SemiBold' }}>수정하기</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView 
          behavior="height" 
          style={{ 
            flex: 1, 
            marginTop: 110,
          }}>
          
          <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}>
            <Text style={styles.mainTitle}>{teamLeaderTitle}</Text>

            <Text style={styles.sectionTitle}>연결된 활동 / 공모전</Text>
            <Text style={styles.connectBox}>{teamLeaderTag}</Text>

            <Text style={styles.sectionTitle}>진행 방식 및 소개</Text>
            <Text style={styles.descriptionBox}>{teamLeaderDescription}</Text>

            <Text style={styles.sectionTitle}>팀장 이름</Text>
            <Text style={styles.readOnlyText}>{teamLeaderName}</Text>

            <Text style={styles.sectionTitle}>전공</Text>
            <View style={styles.departmentRow}>
              <View style={styles.collegeBox}>
                <Text style={styles.collegeText}>{teamLeaderCollege}</Text>
              </View>
              <View style={styles.majorBox}>
                <Text style={styles.majorText}>{teamLeaderMajor}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>학년</Text>
            <View style={styles.departmentRow}>
              <View style={styles.collegeBox}>
                <Text style={styles.collegeText}>{teamLeaderGrade}</Text>
              </View>
              <Text style={styles.emptyBox}></Text>
            </View>

            <Text style={styles.sectionTitle}>역할</Text>
            <Text style={styles.readOnlyText}>{teamLeaderRole}</Text>

            <Text style={styles.sectionTitle}>특징</Text>
            <Text style={styles.readOnlyText}>{teamLeaderTrait}</Text>

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
      width: 345,
      lineHeight: 24,
      fontSize: 20,
      fontFamily: 'Pretendard-SemiBold',
      color: '#000',
      marginBottom: 28,
    },
    connectBox:{
      flex: 1,
      borderWidth: 1,
      borderColor: '#3E6AF433',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      textAlign: 'center',
      fontSize: 16,
      fontFamily: 'Pretendard-SemiBold',
      color: '#1A1A1A',
      marginBottom: 28,
    },
    descriptionBox:{
      minHeight: 100,
      borderWidth: 1,
      borderColor: '#3E6AF433',
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingTop: 15,
      paddingBottom: 15,
      marginBottom: 28,
      fontSize: 14,
    },
    departmentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      marginBottom: 28,
    },
    collegeBox: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#3E6AF433',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    collegeText: {
      fontSize: 14,
      fontFamily: 'Pretendard-Medium',
      color: '#1A1A1A',
    },
    majorBox: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#3E6AF433',
      justifyContent: 'center',
      alignItems: 'center',
    },
    majorText: {
      fontSize: 14,
      fontFamily: 'Pretendard-Medium',
      color: '#1A1A1A',
    }, 
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Pretendard-Medium',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    emptyBox: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    readOnlyText: {
        fontSize: 16,
        color: '#1A1A1A',
        paddingVertical: 8,
        paddingHorizontal: 8,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderColor: '#1A1A1A',
        marginBottom: 28,
    },
});