import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { API_ENDPOINTS } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ModPassword() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    const token = AsyncStorage.getItem('accessToken');
    if (!token) {
      router.replace('/login');
    }
  }, []);
  const changePassword = async () => {
    // 유효성 검사
    if (!currentPassword || !newPassword || !confirmPassword) {
      showModal('⚠️ 알림', '모든 필드를 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showModal('⚠️ 알림', '새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 7) {
      showModal('⚠️ 알림', '비밀번호는 7자 이상이어야 합니다.');
      return;
    }

    const token = await AsyncStorage.getItem('accessToken');
    const response = await fetch(API_ENDPOINTS.UPDATE_USER_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: currentPassword,
        newPassword,
        newPasswordConfirm: confirmPassword,
      }),
    });
    
    const data = await response.json();
    if (response.ok) {
      // 성공 모달 없이 바로 이동
      router.push('./modPasswordConfirm');
      return;
    } else {
      showModal('⚠️ 알림', data.message || '비밀번호 변경에 실패했습니다.');
    }
  };
  const showModal = (title, message, success = false) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsSuccess(success);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (isSuccess) {
      // 비밀번호 변경 성공 시 modPasswordConfirm 화면으로 이동
      router.push('./modPasswordConfirm');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 20,
            padding: 8,
          }}
          onPress={() => router.back()}
        >
          <Text style={{ fontSize: 28, color: '#000', fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
            color: '#000',
          }}
        >
          비밀번호 변경
        </Text>
      </View>
          <Image
            source={require('../../assets/images/lock.svg')}
            style={{ width: 180, height: 180, marginTop: 10, marginBottom: 48, alignSelf: 'center' }}
            contentFit="contain"
          />
      
      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder={focusedInput === 'current' ? '' : '현재 비밀번호'}
            placeholderTextColor="#999"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            onFocus={() => setFocusedInput('current')}
            onBlur={() => setFocusedInput(null)}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder={focusedInput === 'new' ? '' : '새 비밀번호 (영문, 숫자 혼합 7자 이상)'}
            placeholderTextColor="#999"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            onFocus={() => setFocusedInput('new')}
            onBlur={() => setFocusedInput(null)}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder={focusedInput === 'confirm' ? '' : '새 비밀번호 확인'}
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onFocus={() => setFocusedInput('confirm')}
            onBlur={() => setFocusedInput(null)}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={changePassword}
        >
          <Text style={styles.buttonText}>변경하기</Text>
        </TouchableOpacity>
      </View>

      {/* 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleModalClose}
            >
              <Text style={styles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginTop: 70,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    backgroundColor: '#FFFFFF',
    color: '#1A1A1A',
  },
  button: {
    backgroundColor: '#3E6AF4',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 48,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#4869EC',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
