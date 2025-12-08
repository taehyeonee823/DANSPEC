import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateRangePicker = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  minStartDate,
  labelStyle
}) => {
  // 헬퍼 함수들
  const getTodayStart = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
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

  // State 관리
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  // 시작일 Picker 변경 핸들러 (실시간 업데이트)
  const handleTempStartDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const dateOnly = new Date(selectedDate);
      dateOnly.setHours(0, 0, 0, 0);
      setTempStartDate(dateOnly);
    }
  };

  // 시작일 '확인' 버튼 핸들러
  const confirmStartDate = () => {
    const dateOnly = new Date(tempStartDate);
    dateOnly.setHours(0, 0, 0, 0);
    onStartDateChange(dateOnly);

    // 종료일이 시작일보다 이전이면 종료일을 시작일 + 1일로 설정
    if (compareDates(dateOnly, endDate) > 0) {
      const newEndDate = new Date(dateOnly);
      newEndDate.setDate(newEndDate.getDate() + 1);
      onEndDateChange(newEndDate);
      setTempEndDate(newEndDate);
    }
    setShowStartDatePicker(false);
  };

  // 종료일 Picker 변경 핸들러 (실시간 업데이트)
  const handleTempEndDateChange = (event, selectedDate) => {
    if (selectedDate) {
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
      return;
    }

    onEndDateChange(tempEndDate);
    setShowEndDatePicker(false);
  };

  // 시작일 모달 열기 핸들러
  const openStartDatePicker = () => {
    setTempStartDate(startDate);
    setShowStartDatePicker(true);
  };

  // 종료일 모달 열기 핸들러
  const openEndDatePicker = () => {
    setTempEndDate(endDate);
    setShowEndDatePicker(true);
  };

  const minimumStartDate = minStartDate || getTodayStart();

  return (
    <View style={styles.datePickerContainer}>
      <View>
        <Text style={[styles.sectionTitle, labelStyle]}>모집 시작일</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={openStartDatePicker}
        >
          <View style={styles.datePickerTextContainer}>
            <Text style={styles.datePickerText}>{formatDate(startDate)}</Text>
          </View>
          <Image
            source={require('@/assets/images/calendar.svg')}
            style={styles.datePickerArrow}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      <View>
        <Text style={[styles.sectionTitle, labelStyle]}>모집 종료일</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={openEndDatePicker}
        >
          <View style={styles.datePickerTextContainer}>
            <Text style={styles.datePickerText}>{formatDate(endDate)}</Text>
          </View>
          <Image
            source={require('@/assets/images/calendar.svg')}
            style={styles.datePickerArrow}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 시작일 DatePicker Modal */}
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
              minimumDate={minimumStartDate}
              style={styles.iosPicker}
            />
          </View>
        </View>
      </Modal>

      {/* 종료일 DatePicker Modal */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    gap: 10,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    marginBottom: 16,
    color: '#000',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3E6AF433',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  datePickerTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15, 
  },
  datePickerText: {
    fontSize: 16,
    color: '#000',
  },
  datePickerArrow: {
    width: 24,
    height: 24,
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
    fontFamily: 'Pretendard-SemiBold',
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

export default DateRangePicker;
