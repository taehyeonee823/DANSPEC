import { Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, Image } from "react-native";
import React, {useState} from "react";
import { useRouter } from 'expo-router';
import Button from '../../components/Button';
import MultiplelineInput from '../../components/MultiplelineInput';
import SinglelineInput from '../../components/SinglelineInput';

export default function Index() {
  const router = useRouter();
  const [motivationInfo, setMotivation] = useState("");
  const [introductionInfo, setIntroduction] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  // 강제로 표시될 팀장 정보 (실제로는 전역 상태에서 불러와야 함)
  const teamLeaderName = "김단국";
  const teamLeaderDepartment = "SW융합대학";
  const teamLeaderGrade = "3학년";

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
            <Text style={styles.mainTitle}>팀 지원글 작성하기</Text>

            <Text style={styles.sectionTitle}>이름</Text>
            <Text style={styles.readOnlyText}>{teamLeaderName}</Text>

            <Text style={styles.sectionTitle}>학과</Text>
            <Text style={styles.readOnlyText}>{teamLeaderDepartment}</Text>

            <Text style={styles.sectionTitle}>학년</Text>
            <Text style={styles.readOnlyText}>{teamLeaderGrade}</Text>

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
            <Text style={styles.sectionTitle}>연락처</Text>
            <SinglelineInput
                value={contactInfo}
                onChangeText={setContactInfo}
                placeholder="연락처를 입력해주세요."
            />
            <Button
                title="신청하기"
                onPress={() => {
                    // 추후에 fetch로 지원서 제출 로직 추가 예정
                    console.log("지원서 제출됨");
                    router.push('/Team/applyConfirmed');
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
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
    },
  contentContainer: {
        paddingBottom: 50,
        zIndex: 900
    },
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