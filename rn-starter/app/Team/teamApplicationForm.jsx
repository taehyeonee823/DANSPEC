import { Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_ENDPOINTS } from '@/config/api';
import Button from '../../components/Button';
import MultiplelineInput from '../../components/MultiplelineInput';
import SinglelineInput from '../../components/SinglelineInput';

export default function Index() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const teamId = params.teamId ? (Array.isArray(params.teamId) ? params.teamId[0] : params.teamId) : null;

  const [motivationInfo, setMotivation] = useState("");
  const [introductionInfo, setIntroduction] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const [userInfo, setUserInfo] = useState({
    name: '',
    college: '',
    major: '',
    grade: '',
  });
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) {
          setLoadingUser(false);
          return;
        }
        const response = await fetch(API_ENDPOINTS.USER_ME, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setUserInfo({
              name: data.data.name || '',
              college: data.data.college || '',
              major: data.data.major || '',
              grade: data.data.grade || '',
            });
          }
        }
      } catch (e) {
        // ignore
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserInfo();
  }, []);

  const handleSubmit = async () => {
    if (!teamId) {
      Alert.alert('오류', '팀 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      setSubmitting(true);
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }

      const teamIdNum = typeof teamId === 'string' ? parseInt(teamId, 10) : teamId;
      const url = API_ENDPOINTS.APPLY_TO_TEAM(teamIdNum);

      const requestBody = {
        introduction: introductionInfo,
        message: motivationInfo,
        contactNumber: contactInfo.trim() || null,
        portfolioUrl: portfolioLink.trim() || null,
      };

      console.log('지원서 제출 URL:', url);
      console.log('지원서 데이터:', requestBody);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const text = await response.text();
      console.log('응답 상태:', response.status);
      console.log('응답 본문:', text);

      if (!response.ok) {
        console.error('지원서 제출 실패:', response.status, text);
        Alert.alert('오류', '지원서 제출에 실패했습니다. 다시 시도해주세요.');
        return;
      }

      console.log('지원서 제출 성공');
      router.push('/Activity/recruitmentConfirmed');
    } catch (error) {
      console.error('지원서 제출 중 오류:', error);
      Alert.alert('오류', '지원서 제출 중 문제가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

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

        <KeyboardAvoidingView behavior="height" style={{ flex: 1, marginTop: 110 }}>
          <ScrollView style={styles.container}
              contentContainerStyle={styles.contentContainer}>
            <Text style={styles.mainTitle}>팀 지원글 작성하기</Text>

            <Text style={styles.sectionTitle}>이름</Text>
            {loadingUser ? (
              <Text style={styles.readOnlyText}>불러오는 중...</Text>
            ) : (
              <Text style={styles.readOnlyText}>{userInfo.name || '정보 없음'}</Text>
            )}

            <Text style={styles.sectionTitle}>학과</Text>
            {loadingUser ? (
              <Text style={styles.readOnlyText}>불러오는 중...</Text>
            ) : (
              <Text style={styles.readOnlyText}>
                {userInfo.college && userInfo.major
                  ? `${userInfo.college} ${userInfo.major}`
                  : userInfo.college || userInfo.major || '정보 없음'}
              </Text>
            )}

            <Text style={styles.sectionTitle}>학년</Text>
            {loadingUser ? (
              <Text style={styles.readOnlyText}>불러오는 중...</Text>
            ) : (
              <Text style={styles.readOnlyText}>{userInfo.grade ? `${userInfo.grade}학년` : '정보 없음'}</Text>
            )}

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
            <Text style={styles.sectionTitle}>연락처</Text>
            <SinglelineInput
                value={contactInfo}
                onChangeText={setContactInfo}
                placeholder="연락처를 입력해주세요."
            />
            <Text style={styles.sectionTitle}>포트폴리오 / 깃허브 링크</Text>
            <SinglelineInput
                value={portfolioLink}
                onChangeText={setPortfolioLink}
                placeholder="포트폴리오나 깃허브 링크를 입력해주세요." 
            /> 
            <Button
                title={submitting ? "제출 중..." : "신청하기"}
                onPress={handleSubmit}
                disabled={submitting}
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
        fontFamily: 'Pretendard-SemiBold',
        color: '#000',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Pretendard-Medium',
        color: '#333',
        marginBottom: 5,
        marginTop: 15,
    },
    readOnlyText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Pretendard-Medium',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 10,
    },
});