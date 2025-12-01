import React, { useState } from "react";
import { useRouter } from 'expo-router';
import { View, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, StyleSheet, TextInput, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '../../components/Button';

export default function teamRecruitmentForm() {
  const router = useRouter();
  const [titleInfo, setTitleInfo] = useState("");
  const [traitInfo, setTraitInfo] = useState("");
  const [introductionInfo, setIntroductionInfo] = useState("");

  const [inputs, setInputs] = useState([{id: Date.now(), value: ''}]);
  
  // 모집 날짜 관련 state - 초기값을 오늘과 내일로 설정
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

  // 시작일 변경 핸들러
  const handleStartDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowStartDatePicker(false);
      if (selectedDate) {
        // 시간 제거하고 날짜만 설정
        const dateOnly = new Date(selectedDate);
        dateOnly.setHours(0, 0, 0, 0);
        setStartDate(dateOnly);
        // 종료일이 시작일보다 이전이면 종료일을 시작일로 설정
        if (compareDates(dateOnly, endDate) > 0) {
          const newEndDate = new Date(dateOnly);
          newEndDate.setDate(newEndDate.getDate() + 1);
          setEndDate(newEndDate);
        }
      }
    } else {
      // iOS: 실시간 업데이트
      if (selectedDate) {
        // 시간 제거하고 날짜만 설정
        const dateOnly = new Date(selectedDate);
        dateOnly.setHours(0, 0, 0, 0);
        setStartDate(dateOnly);
        // 종료일이 시작일보다 이전이면 종료일을 시작일로 설정
        if (compareDates(dateOnly, endDate) > 0) {
          const newEndDate = new Date(dateOnly);
          newEndDate.setDate(newEndDate.getDate() + 1);
          setEndDate(newEndDate);
        }
      }
    }
  };

  // 종료일 변경 핸들러
  const handleEndDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowEndDatePicker(false);
      if (selectedDate && selectedDate >= startDate) {
        setEndDate(selectedDate);
      }
    } else {
      // iOS: 실시간 업데이트
      if (selectedDate && selectedDate >= startDate) {
        setEndDate(selectedDate);
      }
    }
  };

  // 모집글 저장 함수
  const saveRecruitment = () => {
    const roles = inputs.map(input => input.value.trim()).filter(value => value !== '');

    const newRecruitment = {
      title: titleInfo,
      tag: "기타",
      description: introductionInfo,
      name: teamLeaderName,
      department: "SW융합대학",
      grade: "3학년",
      role: roles,
      trait: traitInfo,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };

    console.log("저장할 데이터:", newRecruitment);

    // TODO: 백엔드 API 연결
    // await fetch('YOUR_API_ENDPOINT', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newRecruitment)
    // });

    router.replace('/Activity/recruitmentConfirmed');
  };

  const teamLeaderName = "김단국";

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
            <Text style={styles.mainTitle}>팀 모집글 작성하기</Text>
            <Text style={styles.caption}>원하는 활동을 함께할 팀원을 모집해보세요.</Text>

            <Text style={styles.sectionTitle}>연결할 활동 / 공모전</Text>
            <Text style={styles.readOnlyText}>기타</Text>

            <Text style={styles.sectionTitle}>제목</Text>
            <TextInput
                style={styles.defaultInput}
                value={titleInfo}
                onChangeText={setTitleInfo}
                placeholder="제목을 입력해주세요." 
            />

            <Text style={styles.sectionTitle}>팀장 이름</Text>
            <Text style={styles.readOnlyText}>{teamLeaderName}</Text>
            <Text style={styles.sectionTitle}>학과</Text>
            <Text style={styles.readOnlyText}>SW융합대학</Text>
            <Text style={styles.sectionTitle}>학년</Text>
            <Text style={styles.readOnlyText}>3학년</Text>
            <Text style={styles.sectionTitle}>모집 인원</Text>
            
            <Text style={styles.sectionTitle}>모집 날짜</Text>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerRow}>
                <Text style={styles.dateLabel}>시작일</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={styles.datePickerText}>{formatDate(startDate)}</Text>
                  <Text style={styles.datePickerArrow}>▼</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.datePickerRow}>
                <Text style={styles.dateLabel}>종료일</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text style={styles.datePickerText}>{formatDate(endDate)}</Text>
                  <Text style={styles.datePickerArrow}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            {showStartDatePicker && (
              <>
                {Platform.OS === 'ios' ? (
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
                          <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                            <Text style={styles.modalConfirmText}>확인</Text>
                          </TouchableOpacity>
                        </View>
                        <DateTimePicker
                          value={startDate}
                          mode="date"
                          display="spinner"
                          onChange={handleStartDateChange}
                          minimumDate={getTodayStart()}
                          style={styles.iosPicker}
                        />
                      </View>
                    </View>
                  </Modal>
                ) : (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={handleStartDateChange}
                    minimumDate={getTodayStart()}
                  />
                )}
              </>
            )}

            {showEndDatePicker && (
              <>
                {Platform.OS === 'ios' ? (
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
                          <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                            <Text style={styles.modalConfirmText}>확인</Text>
                          </TouchableOpacity>
                        </View>
                        <DateTimePicker
                          value={endDate}
                          mode="date"
                          display="spinner"
                          onChange={handleEndDateChange}
                          minimumDate={startDate}
                          style={styles.iosPicker}
                        />
                      </View>
                    </View>
                  </Modal>
                ) : (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={handleEndDateChange}
                    minimumDate={startDate}
                  />
                )}
              </>
            )}
            
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
                    <Text style={[
                      styles.buttonText,
                      isLastItem ? styles.addText : styles.removeText
                    ]}>
                      {isLastItem ? '+' : '-'}
                    </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  caption: {
    fontSize: 14,
    fontWeight: '400', 
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
  },
  readOnlyText: {
    fontSize: 16,
    color: '#555',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  }, 
  defaultInput: {
    height: 48,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
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
    marginBottom: 10,
  },
  input: {
    flex: 1, 
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
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
    backgroundColor: '#007AFF',
  },
  removeButton: {
    backgroundColor: '#ffdddd',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2,
  },
  addText: {
    color: '#fff',
  },
  removeText: {
    color: '#ff4444',
  },
  datePickerContainer: {
    gap: 10,
  },
  datePickerRow: {
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 5,
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
    fontSize: 12,
    color: '#666',
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
});