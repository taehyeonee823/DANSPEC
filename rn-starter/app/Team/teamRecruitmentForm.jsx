import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Image } from 'expo-image';
import Button from '../../components/Button';
import DateRangePicker from '../../components/DateRangePicker';
import MultilineInput from '../../components/MultiplelineInput';
import { API_ENDPOINTS } from '@/config/api';

export default function teamRecruitmentForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
   
  const getTodayStart = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  };
  
  const getTomorrowStart = () => {
    const date = getTodayStart();
    date.setDate(date.getDate() + 1);
    return date;
  };
  
  // State 초기화
  const [titleInfo, setTitleInfo] = useState("");
  const [traitInfo, setTraitInfo] = useState("");
  const [introductionInfo, setIntroductionInfo] = useState("");
  const activityTitle = params.activityTitle;
  const [inputs, setInputs] = useState([{id: Date.now(), value: ''}]);
  const [recruitCount, setRecruitCount] = useState(1);
  
  // 포커스 상태 (placeholder 숨김용)
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [focusedRoleId, setFocusedRoleId] = useState(null);
  const [isTraitFocused, setIsTraitFocused] = useState(false);
  const [isIntroFocused, setIsIntroFocused] = useState(false);
  
  // 모집 날짜 관련 state
  const [startDate, setStartDate] = useState(getTodayStart());
  const [endDate, setEndDate] = useState(getTomorrowStart());

  // 역할 입력 핸들러
  const handleChange = (text, id) => {
    const newInputs = inputs.map((item) => {
      if (item.id === id) {
        return { ...item, value: text };
      }
      return item;
    });
    setInputs(newInputs);
  };
  
  const addInput = () => {
    const newId = Date.now();
    const newInput = {id: newId, value: ''};
    setInputs((prevInputs) => {
      return [...prevInputs, newInput];
    });
  };

  const removeInput = (id) => {
    if (inputs.length === 1) return;
    const newInputs = inputs.filter((item) => item.id !== id);
    setInputs(newInputs);
  };

  // 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 모집글 저장 함수
  const saveRecruitment = async () => {
    const roles = inputs.map(input => input.value.trim()).filter(value => value !== '');

    // 필수 입력값 검증
    if (!titleInfo.trim()) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return;
    }
    if (roles.length === 0) {
      Alert.alert('알림', '최소 한 개 이상의 역할을 입력해주세요.');
      return;
    }
    if (!traitInfo.trim()) {
      Alert.alert('알림', '특성을 입력해주세요.');
      return;
    }
    if (!introductionInfo.trim()) {
      Alert.alert('알림', '진행 방식 및 한 줄 소개를 입력해주세요.');
      return;
    }

    // 백엔드 API 형식에 맞게 데이터 구성
    const newRecruitment = {
      eventId: 0, // activityTitle에서 eventId를 추출해야 한다면 수정 필요
      title: titleInfo,
      promotionText: introductionInfo || "",
      role: roles,
      characteristic: traitInfo || "",
      capacity: recruitCount,
      recruitmentStartDate: formatDateForAPI(startDate),
      recruitmentEndDate: formatDateForAPI(endDate),
    };

    try {
      console.log("저장할 데이터:", newRecruitment);
      console.log("요청 URL:", API_ENDPOINTS.CREATE_TEAM);

      const response = await fetch(API_ENDPOINTS.CREATE_TEAM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecruitment),
      });

      console.log("응답 상태:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("에러 응답 내용:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log("서버 응답:", result);

      Alert.alert('성공', '팀 모집글이 등록되었습니다.', [
        { text: '확인', onPress: () => router.replace('../Activity/recruitmentConfirmed') }
      ]);
    } catch (error) {
      console.error("모집글 저장 오류:", error);
      Alert.alert('오류', `모집글 등록에 실패했습니다.\n${error.message}`);
    }
  };

  //전역에서 팀장 이름, 학과, 학년 끌고 올 예정
  const teamLeaderName = "김단국";

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
            <Text style={styles.mainTitle}>팀 모집글 작성하기</Text>
            <Text style={styles.caption}>공모전·교내·대외 활동별로 함께할 팀원을 모집해보세요.</Text>
            <Text style={styles.sectionTitle}>연결할 활동 / 공모전</Text>
            <Text style={styles.connectBox}>{activityTitle}</Text>

            <Text style={styles.sectionTitle}>제목</Text>
            <TextInput
                style={styles.defaultInput}
                value={titleInfo}
                onChangeText={setTitleInfo}
                placeholder={isTitleFocused ? '' : "제목을 입력해주세요"}
                placeholderTextColor="#CCCCCC"
                onFocus={() => setIsTitleFocused(true)}
                onBlur={() => setIsTitleFocused(false)}
            />

            <Text style={styles.sectionTitle}>팀장 이름</Text>
            <Text style={styles.readOnlyText}>{teamLeaderName}</Text>
            <Text style={styles.sectionTitle}>학과</Text>
            <View style={styles.departmentRow}>
              <View style={styles.collegeBox}>
                <Text style={styles.collegeText}>SW융합대학</Text>
              </View>
              <View style={styles.majorBox}>
                <Text style={styles.majorText}>통계데이터사이언스</Text>
              </View>
            </View>
            <Text style={styles.sectionTitle}>학년</Text>
            <View style={styles.departmentRow}>
              <View style={styles.collegeBox}>
                <Text style={styles.collegeText}>3학년</Text>
              </View>
              <Text style={styles.emptyBox}></Text>
            </View>
            <Text style={styles.sectionTitle}>모집 인원</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setRecruitCount(Math.max(1, recruitCount - 1))}
              >
                <Image
                  source={require('@/assets/images/minus.svg')}
                  style={styles.counterIcon}
                  contentFit="contain"
                />
              </TouchableOpacity>
              <Text style={styles.counterText}>{recruitCount}명</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setRecruitCount(recruitCount + 1)}
              >
                <Image
                  source={require('@/assets/images/add.svg')}
                  style={styles.counterIcon}
                  contentFit="contain"
                />
              </TouchableOpacity>
            </View>
            
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              minStartDate={getTodayStart()}
              labelStyle={styles.sectionTitle}
            />
            
            {/* 역할 입력 섹션 */}
            <Text style={styles.sectionTitle}>역할</Text>
            
            {inputs.map((item, index) => { 
              const isLastItem = index === inputs.length - 1;
              return (
                <View key={item.id} style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder={focusedRoleId === item.id ? '' : `모집 역할 #${index + 1} (예: 기획자)`}
                    placeholderTextColor="#CCCCCC"
                    value={item.value}
                    onChangeText={(text) => handleChange(text, item.id)}
                    onFocus={() => setFocusedRoleId(item.id)}
                    onBlur={() => setFocusedRoleId(null)}
                  />
                  <TouchableOpacity
                    onPress={() => isLastItem ? addInput() : removeInput(item.id)}
                    style={[
                      styles.circleButton,
                      isLastItem ? styles.addButton : styles.removeButton
                    ]}
                  >
                    <Image
                      source={isLastItem 
                        ? require('@/assets/images/add.svg')
                        : require('@/assets/images/minus.svg')
                      }
                      style={styles.buttonIcon}
                      contentFit="contain"
                    />
                  </TouchableOpacity>
                </View>
              );
            })}

            <Text style={styles.sectionTitle}>특성</Text>
            <TextInput
                style={styles.defaultInput}
                value={traitInfo}
                onChangeText={setTraitInfo}
                placeholder={isTraitFocused ? '' : "팀이 선호하는 인재상에 대해 작성해주세요"}
                placeholderTextColor="#CCCCCC"
                onFocus={() => setIsTraitFocused(true)}
                onBlur={() => setIsTraitFocused(false)}
            />

            <Text style={styles.sectionTitle}>진행 방식 및 한 줄 소개</Text>
            <MultilineInput
                value={introductionInfo}
                onChangeText={setIntroductionInfo}
                placeholder={isIntroFocused ? '' : "모집글에 대한 소개를 상세하게 작성해주세요"}
                onFocus={() => setIsIntroFocused(true)}
                onBlur={() => setIsIntroFocused(false)}
            />
            <View style={{ height: 20 }} />
            <Button
              title="등록하기"
              onPress={saveRecruitment}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  connectBox:{
    flex: 1,
    borderWidth: 1,
    borderColor: '#3E6AF433',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    textAlign: 'center',
    marginBottom: 28,
    fontFamily: 'Pretendard-SemiBold',
  },
  mainTitle: {
    width: 345,
    lineHeight: 24,
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 20,
    marginBottom: 12,
    color: '#000',
  },
  caption: {
    width: 304,
    height: 17,
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 17,
    textAlign: 'left',
    color: '#666',
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    marginBottom: 16,
    color: '#000',
  },
  // readOnlyText 스타일 수정 (fontColor 제거, color로 통일)
  readOnlyText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#A6A6A6',
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
  collegeText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#A6A6A6',
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
  majorText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#A6A6A6',
  }, 
  defaultInput: {
    height: 48,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#1A1A1A',
    padding: 8,
    fontSize: 16,
    marginBottom: 28,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  input: {
    flex: 1, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    padding: 10,
    fontSize: 16,
  },
  circleButton: {
    marginLeft: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#FFFFFF',
  },
  removeButton: {
    backgroundColor: '#FFFFFF',
  },
  buttonIcon: {
    width: 24,
    height: 24,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    gap: 20,
  },
  counterButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  counterIcon: {
    width: 24,
    height: 24,
  },
  counterText: {
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    color: '#000',
    minWidth: 50,
    textAlign: 'center',
  },
});