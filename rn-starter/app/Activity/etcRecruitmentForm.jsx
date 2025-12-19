import React, { useState, useEffect } from "react";
import { useRouter } from 'expo-router';
import { View, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, StyleSheet, TextInput, Platform, Modal } from 'react-native';
import { Image } from 'expo-image';
import * as SecureStore from 'expo-secure-store';
import Button from '../../components/Button';
import DateRangePicker from '../../components/DateRangePicker';
import { API_ENDPOINTS } from '../../config/api';

export default function etcteamRecruitmentForm() {
  const router = useRouter();
  const [titleInfo, setTitleInfo] = useState("");
  const [traitInfo, setTraitInfo] = useState("");
  const [introductionInfo, setIntroductionInfo] = useState("");
  const [inputs, setInputs] = useState([{id: Date.now(), value: ''}]);
  const [recruitCount, setRecruitCount] = useState(1);
  
  // 모집 날짜 관련 state
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
  
  const [startDate, setStartDate] = useState(getTodayStart());
  const [endDate, setEndDate] = useState(getTomorrowStart());

  // 알림 모달 state
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

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

  // 날짜를 YYYY-MM-DD 형식으로 변환하는 함수 (API 전송용)
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const [userInfo, setUserInfo] = useState({
    name: '',
    college: '',
    major: '',
    grade: '',
  });
  const [loadingUser, setLoadingUser] = useState(true);

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

  // 모집글 저장 함수
  const saveRecruitment = async () => {
    const roles = inputs.map(input => input.value.trim()).filter(value => value !== '');

    // 필수 입력값 검증
    if (!titleInfo.trim()) {
      setAlertMessage('제목을 입력해주세요.');
      setShowAlertModal(true);
      return;
    }
    if (roles.length === 0) {
      setAlertMessage('최소 한 개 이상의 역할을 입력해주세요.');
      setShowAlertModal(true);
      return;
    }
    if (!traitInfo.trim()) {
      setAlertMessage('특성을 입력해주세요.');
      setShowAlertModal(true);
      return;
    }
    if (!introductionInfo.trim()) {
      setAlertMessage('진행 방식 및 한 줄 소개를 입력해주세요.');
      setShowAlertModal(true);
      return;
    }

    // 백엔드 API 형식에 맞게 데이터 구성 (기타 카테고리는 eventId가 null)
    const newRecruitment = {
      eventId: null,
      title: titleInfo,
      promotionText: introductionInfo || "",
      role: roles,
      characteristic: traitInfo || "",
      capacity: recruitCount,
      recruitmentStartDate: formatDateForAPI(startDate),
      recruitmentEndDate: formatDateForAPI(endDate),
    };

    try {
      console.log("=== 기타 모집글 등록 ===");
      console.log("eventId: null (기타 카테고리)");
      console.log("저장할 데이터:", JSON.stringify(newRecruitment, null, 2));
      console.log("요청 URL:", API_ENDPOINTS.CREATE_TEAM);

      // 토큰 가져오기
      const accessToken = await SecureStore.getItemAsync('accessToken');
      
      if (!accessToken) {
        Alert.alert('알림', '로그인이 필요합니다.', [
          { text: '확인', onPress: () => router.replace('/login') }
        ]);
        return;
      }

      const response = await fetch(API_ENDPOINTS.CREATE_TEAM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
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

      // 성공 알림창 없이 바로 이동
      router.replace('/Activity/recruitmentConfirmed');
    } catch (error) {
      console.error("모집글 저장 오류:", error);
      Alert.alert('오류', `모집글 등록에 실패했습니다.\n${error.message}`);
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
            style={{ width: 28, height: 28 }}
            contentFit="contain"
          />
        </TouchableOpacity>

        <KeyboardAvoidingView behavior="height" style={{ flex: 1, marginTop: 110 }}>
          <ScrollView style={styles.container}
              contentContainerStyle={styles.contentContainer}>
            <Text style={styles.mainTitle}>팀 모집글 작성하기</Text>
            <Text style={styles.caption}>공모전·교내·대외 활동별로 함께할 팀원을 모집해보세요.</Text>
            
            {/* 고정 정보 섹션 */}
            <Text style={styles.sectionTitle}>연결할 활동 / 공모전</Text>
            <Text style={styles.readOnlyText}>기타</Text>

            <Text style={styles.sectionTitle}>제목</Text>
            <TextInput
                style={styles.defaultInput}
                value={titleInfo}
                onChangeText={setTitleInfo}
                placeholder="제목을 입력해주세요" 
            />

            <Text style={styles.sectionTitle}>팀장 이름</Text>
            {loadingUser ? (
              <Text style={styles.readOnlyText}>불러오는 중...</Text>
            ) : (
              <Text style={styles.readOnlyText}>{userInfo.name || '정보 없음'}</Text>
            )}
            <Text style={styles.sectionTitle}>학과</Text>
            <View style={styles.departmentRow}>
              <View style={styles.collegeBox}>
                <Text style={styles.collegeText}>{loadingUser ? '불러오는 중...' : (userInfo.college || '정보 없음')}</Text>
              </View>
              <View style={styles.majorBox}>
                <Text style={styles.majorText}>{loadingUser ? '불러오는 중...' : (userInfo.major || '정보 없음')}</Text>
              </View>
            </View>
            <Text style={styles.sectionTitle}>학년</Text>
            {loadingUser ? (
              <Text style={styles.readOnlyText}>불러오는 중...</Text>
            ) : (
              <Text style={styles.readOnlyText}>{userInfo.grade ? `${userInfo.grade}학년` : '정보 없음'}</Text>
            )}
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

            {/* 모집 기간 섹션 */}
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
                    placeholder={`모집 역할 #${index + 1} (예: 기획자)`}
                    value={item.value}
                    onChangeText={(text) => handleChange(text, item.id)}
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
                placeholder="팀이 선호하는 인재상에 대해 작성해주세요."
            />

            <Text style={styles.sectionTitle}>진행 방식 및 한 줄 소개</Text>
            <TextInput
                style={styles.multilineInput}
                value={introductionInfo}
                onChangeText={setIntroductionInfo}
                placeholder="모집글에 대한 소개를 상세하게 작성해주세요."
                multiline={true}
            />
            <View style={{ height: 20 }} />
            <Button
              title="등록하기"
              onPress={saveRecruitment}
            />
          </ScrollView>
        </KeyboardAvoidingView>

        {/* 알림 모달 */}
        <Modal
          visible={showAlertModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAlertModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Image
                source={require('@/assets/images/alert.svg')}
                style={styles.alertIcon}
                contentFit="contain"
              />
              <Text style={styles.modalTitle}>{alertMessage}</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={() => setShowAlertModal(false)}
                >
                  <Text style={styles.confirmButtonText}>확인</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
  );
}

// ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contentContainer: {
    paddingBottom: 40,
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
    fontFamily: 'Pretendard-Regular',
    color: '#1A1A1A', // fontColor -> color로 수정
    borderBottomColor: '#CCCCCC',
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
  majorText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#A6A6A6',
  }, 
  defaultInput: {
    height: 48,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    fontSize: 16,
    marginBottom: 28,
  },
  multilineInput: {
    height: 100,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    textAlignVertical: 'top',
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
    borderBottomColor: '#ddd',
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
    marginBottom: 28,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    alignItems: 'center',
  },
  alertIcon: {
    width: 48,
    height: 48,
    flexShrink: 0,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#000',
  },
});