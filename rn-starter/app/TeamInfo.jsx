import { Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, Image } from "react-native";
import React, {useState} from "react";
import { useRouter } from 'expo-router';
import Button from '../components/Button';
import MultiplelineInput from '../components/MultiplelineInput';
import SinglelineInput from '../components/SinglelineInput';
import teamPostData from './teamApplyBoxDemo.json'; // 팀 모집글 데이터 불러오기

export default function Index() {
  const router = useRouter();
  const [motivationInfo, setMotivation] = useState("");
  const [introductionInfo, setIntroduction] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  // 팀 모집글 작성자 정보 사용
  const teamLeaderName = teamPostData.name; 
  const teamLeaderGrade = teamPostData.grade;
  const teamLeaderDepartment = "SW융합대학"; // 예시로 유지

  return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        {/* 뒤로 가기 버튼 */}
        <TouchableOpacity
          style={{ position: 'absolute', top:60, left: 20, zIndex: 999, padding: 8 }}
          onPress={() => router.back()}
        >
          <Text style={{ fontSize: 28, color: '#000', fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView behavior="height" style={{ flex: 1, marginTop: 110 }}>
          

          <ScrollView style={styles.container}
              contentContainerStyle={styles.contentContainer}>
            <Text style={styles.mainTitle}>[데분 캠프] 데이터 분석 팀 1 모집</Text>

            <Text style={styles.sectionTitle}>이름</Text>
            <Text style={styles.readOnlyText}>{teamLeaderName}</Text>

            <Text style={styles.sectionTitle}>학과</Text>
            <Text style={styles.readOnlyText}>{teamLeaderDepartment}</Text>

            <Text style={styles.sectionTitle}>학년</Text>
            <Text style={styles.readOnlyText}>{teamLeaderGrade}</Text>

            <Text style={styles.sectionTitle}>연락처</Text>
            <SinglelineInput
                value={contactInfo}
                onChangeText={setContactInfo}
                placeholder="연락처를 입력해주세요."
            />
            <Text style={styles.sectionTitle}>간단 소개글</Text>
            <MultiplelineInput
                value={introductionInfo}
                onChangeText={setIntroduction}
                placeholder="자신에 대한 간단한 소개를 한 줄 이상 작성해주세요." 
            />

            <Text style={styles.sectionTitle}>지원 동기</Text>
            <MultiplelineInput
                value={motivationInfo}
                onChangeText={setMotivation}
                placeholder="팀에 지원하게 된 동기와 기여하고 싶은 부분을 상세히 작성해 주세요." 
            />
            <Text style={styles.sectionTitle}>포트폴리오 / 깃허브 링크</Text>
            <SinglelineInput
                value={portfolioLink}
                onChangeText={setPortfolioLink}
                placeholder="포트폴리오나 깃허브 링크를 입력해주세요." 
            /> 
            <Button
                title="지원하기"
                onPress={() => {
                    // 추후에 fetch로 지원서 제출 로직 추가 예정
                    console.log("지원서 제출됨");
                    router.push('/teamApplicationForm');
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
    statusActive: {
        backgroundColor: '#d0f0d0', // 모집 중
        color: '#008000',
    },
    statusInactive: {
        backgroundColor: '#ffe0e0', // 모집 완료 등
        color: '#cc0000',
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