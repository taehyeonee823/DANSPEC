import { Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
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
  
  // 연락처 입력값만 저장 (010 제외)
  const [contactNumber, setContactNumber] = useState("");
  
  // contactInfo가 변경될 때 contactNumber 업데이트 (010 제거)
  useEffect(() => {
    if (contactInfo && contactInfo.startsWith('010')) {
      setContactNumber(contactInfo.substring(3));
    } else if (contactInfo && !contactInfo.startsWith('010')) {
      setContactNumber(contactInfo);
    }
  }, []);
  
  // contactNumber가 변경될 때 contactInfo 업데이트 (010 추가)
  const handleContactNumberChange = (text) => {
    setContactNumber(text);
    setContactInfo('010' + text);
  };

  const [userInfo, setUserInfo] = useState({
    name: '',
    college: '',
    major: '',
    grade: '',
  });
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [teamDetail, setTeamDetail] = useState(null);
  const [teamTitle, setTeamTitle] = useState('');

  useEffect(() => {
    const fetchTeamDetail = async () => {
      if (!teamId) return;
      const teamIdNum = Number(teamId);
      if (Number.isNaN(teamIdNum)) return;

      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) return;

        const url = API_ENDPOINTS.GET_TEAM_DETAIL(teamIdNum);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await response.text();
        if (!response.ok || !text || text.trim().length === 0) return;

        const json = JSON.parse(text);
        const data = json?.success && json?.data ? json.data : json;
        setTeamDetail(data);

        if (data?.title) setTeamTitle(data.title);
      } catch (e) {
        // ignore
      }
    };

    fetchTeamDetail();
  }, [teamId]);

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
    <View style={styles.page}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBarButton} onPress={() => router.back()}>
          <Image
            source={require('@/assets/images/left.svg')}
            style={styles.topBarIcon}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior="height" style={styles.body}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.mainTitle}>{teamDetail?.title || teamTitle || '팀 지원글 작성하기'}</Text>

          <Text style={styles.sectionTitle}>연결된 활동 / 공모전</Text>
          <Text style={styles.connectBox}>{teamDetail?.connectedActivityTitle || '자율 모집'}</Text>

          <Text style={styles.sectionTitle}>이름</Text>
          <Text style={styles.readOnlyText}>
            {loadingUser ? '불러오는 중...' : (userInfo.name || '정보 없음')}
          </Text>

          <Text style={styles.sectionTitle}>학과</Text>
          <View style={styles.departmentRow}>
            <View style={styles.collegeBox}>
              <Text style={styles.collegeText}>
                {loadingUser ? '불러오는 중...' : (userInfo.college || '정보 없음')}
              </Text>
            </View>
            <View style={styles.majorBox}>
              <Text style={styles.majorText}>
                {loadingUser ? '불러오는 중...' : (userInfo.major || '정보 없음')}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>학년</Text>
          <View style={styles.departmentRow}>
            <View style={styles.collegeBox}>
              <Text style={styles.collegeText}>
                {loadingUser ? '불러오는 중...' : (userInfo.grade ? `${userInfo.grade}학년` : '정보 없음')}
              </Text>
            </View>
            <Text style={styles.emptyBox} />
          </View>

          <Text style={styles.sectionTitle}>간단 소개글</Text>
          <MultiplelineInput
            value={introductionInfo}
            onChangeText={setIntroduction}
            placeholder="간단하게 자기소개를 작성해주세요"
          />

          <Text style={styles.sectionTitle}>지원 동기</Text>
          <MultiplelineInput
            value={motivationInfo}
            onChangeText={setMotivation}
            placeholder="지원 동기를 작성해주세요"
          />

          <Text style={styles.sectionTitle}>연락처</Text>
          <View style={styles.departmentRow}>
            <View style={styles.collegeBox}>
              <Text style={styles.collegeText}>010</Text>
            </View>
            <View style={styles.contactInputBox}>
              <TextInput
                value={contactNumber}
                onChangeText={handleContactNumberChange}
                placeholder="연락처를 입력해주세요."
                placeholderTextColor="#999"
                style={styles.contactInput}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>포트폴리오 / 깃허브 링크</Text>
          <SinglelineInput
            value={portfolioLink}
            onChangeText={setPortfolioLink}
            placeholder="링크를 입력해주세요"
          />

          <Button
            title={submitting ? '제출 중...' : '신청하기'}
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
  page: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    zIndex: 999,
  },
  topBarButton: {
    padding: 8,
  },
  topBarIcon: {
    width: 30,
    height: 30,
  },
  body: {
    flex: 1,
    marginTop: 110,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    paddingBottom: 50,
    zIndex: 900,
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    marginBottom: 16,
    color: '#000',
  },
  readOnlyText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#1A1A1A',
    borderBottomColor: '#1A1A1A',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    marginBottom: 28,
    flex: 1,
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
  collegeText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#1A1A1A',
  },
  majorText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#1A1A1A',
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
  connectBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3E6AF433',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    textAlign: 'center',
    marginBottom: 28,
    fontFamily: 'Pretendard-SemiBold',
    color: '#1A1A1A',
  },
  contactInputBox: {
    flex: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3E6AF433',
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInput: {
    width: '100%',
    textAlign: 'center',
    color: '#000',
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});