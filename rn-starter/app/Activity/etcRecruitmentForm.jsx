import React, { useState } from "react";
import { useRouter } from 'expo-router';
import { View, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, StyleSheet, TextInput, Platform, Modal } from 'react-native';
import { Image } from 'expo-image';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import Button from '../../components/Button';

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
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // 임시 선택 날짜 state (iOS Modal에서 '확인'을 누르기 전까지 최종 확정되지 않도록)
  const [tempStartDate, setTempStartDate] = useState(getTodayStart());
  const [tempEndDate, setTempEndDate] = useState(getTomorrowStart());


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

  // 날짜 포맷팅 함수
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 날짜 비교 헬퍼 함수 (시간 제외)
  const compareDates = (date1, date2) => {
    const d1 = new Date(date1);
    d1.setHours(0, 0, 0, 0);
    const d2 = new Date(date2);
    d2.setHours(0, 0, 0, 0);
    return d1.getTime() - d2.getTime();
  };

  // 시작일 Picker 변경 핸들러 (실시간 업데이트)
  const handleTempStartDateChange = (event, selectedDate) => {
    if (selectedDate) {
        // 시간 제거하고 날짜만 설정
        const dateOnly = new Date(selectedDate);
        dateOnly.setHours(0, 0, 0, 0);
        setTempStartDate(dateOnly);
    }
  };

  // 시작일 '확인' 버튼 핸들러
  const confirmStartDate = () => {
    const dateOnly = tempStartDate;
    dateOnly.setHours(0, 0, 0, 0);
    setStartDate(dateOnly);

    // 종료일이 시작일보다 이전이면 종료일을 시작일 + 1일로 설정
    if (compareDates(dateOnly, endDate) > 0) {
      const newEndDate = new Date(dateOnly);
      newEndDate.setDate(newEndDate.getDate() + 1);
      setEndDate(newEndDate);
      setTempEndDate(newEndDate); // 임시 종료일도 업데이트
    }
    setShowStartDatePicker(false);
  };
  
  // 종료일 Picker 변경 핸들러 (실시간 업데이트)
  const handleTempEndDateChange = (event, selectedDate) => {
    if (selectedDate) {
      // 시간 제거하고 날짜만 설정 (옵션)
      const dateOnly = new Date(selectedDate);
      dateOnly.setHours(0, 0, 0, 0);
      setTempEndDate(dateOnly);
    }
  };

  // 종료일 '확인' 버튼 핸들러
  const confirmEndDate = () => {
    // 최소 날짜 제한 (startDate)보다 작으면 선택 불가
    if (compareDates(tempEndDate, startDate) < 0) {
      alert("모집 종료일은 시작일보다 빠를 수 없습니다.");
      // 모달을 닫지 않고 사용자에게 재선택 요청
      return; 
    }
    
    setEndDate(tempEndDate);
    setShowEndDatePicker(false);
  };
  
  // 시작일 모달 열기 핸들러
  const openStartDatePicker = () => {
    setTempStartDate(startDate); // 현재 확정된 값으로 임시값 초기화
    setShowStartDatePicker(true);
  };
  
  // 종료일 모달 열기 핸들러
  const openEndDatePicker = () => {
    setTempEndDate(endDate); // 현재 확정된 값으로 임시값 초기화
    setShowEndDatePicker(true);
  };


  // 모집글 저장 함수
  const saveRecruitment = () => {
    const roles = inputs.map(input => input.value.trim()).filter(value => value !== '');

    const newRecruitment = {
      title: titleInfo,
      tag: "기타",
      name: teamLeaderName,
      department: "SW융합대학",
      grade: "3학년",
      recruitCount: recruitCount,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      role: roles,
      trait: traitInfo,
      description: introductionInfo,
    };

    console.log("저장할 데이터:", newRecruitment);
    router.replace('/Activity/recruitmentConfirmed');
  };

  const teamLeaderName = "김단국";

  return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <TouchableOpacity
          style={{ position: 'absolute', top:60, left: 8, zIndex: 999, padding: 8 }}
          onPress={() => router.back()}
        >
          <Text style={{ fontSize: 28, color: '#000', fontWeight: 'bold' }}>←</Text>
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
            <Text style={styles.readOnlyText}>{teamLeaderName}</Text>
            <Text style={styles.sectionTitle}>학과</Text>
            <View style={styles.departmentRow}>
              <View style={styles.collegeBox}>
                <Text style={styles.collegeText}>SW융합대학</Text>
              </View>
              <View style={styles.majorBox}>
                <Text style={styles.majorText}>통계데이터사이언스학과</Text>
              </View>
            </View>
            <Text style={styles.sectionTitle}>학년</Text>
            <Text style={styles.readOnlyText}>3학년</Text>
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
            
            {/* 모집 기간 섹션 (제목 통일) */}
            <Text style={[styles.sectionTitle, { marginTop: 0 }]}>모집 기간</Text>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerRow}>
                <Text style={styles.dateLabel}>시작일</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={openStartDatePicker}
                >
                  <Text style={styles.datePickerText}>{formatDate(startDate)}</Text>
                  <Image
                    source={require('@/assets/images/down.svg')}
                    style={styles.datePickerArrow}
                    contentFit="contain"
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.datePickerRow}>
                <Text style={styles.dateLabel}>종료일</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={openEndDatePicker}
                >
                  <Text style={styles.datePickerText}>{formatDate(endDate)}</Text>
                  <Image
                    source={require('@/assets/images/down.svg')}
                    style={styles.datePickerArrow}
                    contentFit="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* 시작일 DatePicker Modal (iOS 전용) */}
            <Modal
              visible={showStartDatePicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowStartDatePicker(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                      <Text style={styles.modalCancelText}>취소</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>시작일 선택</Text>
                    <TouchableOpacity onPress={confirmStartDate}>
                      <Text style={styles.modalConfirmText}>확인</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={tempStartDate}
                    mode="date"
                    display="spinner"
                    onChange={handleTempStartDateChange}
                    minimumDate={getTodayStart()}
                    style={styles.iosPicker}
                  />
                </View>
              </View>
            </Modal>

            {/* 종료일 DatePicker Modal (iOS 전용) */}
            <Modal
              visible={showEndDatePicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowEndDatePicker(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                      <Text style={styles.modalCancelText}>취소</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>종료일 선택</Text>
                    <TouchableOpacity onPress={confirmEndDate}>
                      <Text style={styles.modalConfirmText}>확인</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={tempEndDate}
                    mode="date"
                    display="spinner"
                    onChange={handleTempEndDateChange}
                    minimumDate={startDate}
                    style={styles.iosPicker}
                  />
                </View>
              </View>
            </Modal>
            
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
    color: '#1A1A1A',
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
  datePickerContainer: {
    gap: 10,
    marginBottom: 28, // 섹션 간격 추가
  },
  datePickerRow: {
    // 섹션 타이틀 대신 간결한 라벨을 사용하므로, 여기에 플렉스 없이 요소 배치
    // 기존 코드의 Text style={styles.sectionTitle} 부분을 제거했기 때문에 이 스타일은 유지됩니다.
  },
  dateLabel: {
    fontSize: 16, // sectionTitle과 유사하게 키움
    fontFamily: 'Pretendard-Medium',
    color: '#000',
    marginBottom: 10,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  datePickerText: {
    fontSize: 16,
    color: '#000',
  },
  datePickerArrow: {
    width: 15,
    height: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
  },
  modalConfirmText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  iosPicker: {
    width: '100%',
    height: 200,
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
});