import { useState, useEffect, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { API_ENDPOINTS } from '@/config/api';

export default function VerificationScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  // 타이머 관련 상태
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [codeVerified, setCodeVerified] = useState(false);

  // 타이머 카운트다운
  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timer]);

  // 타이머 포맷 (mm:ss)
  const formatTimer = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
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
      router.push({
        pathname: '/signup',
        params: {
          email,
          verificationCode,
          password,
          confirmPassword
        }
      });
    }
  };

  const handleCheckDuplicate = async () => {
    if (!email) {
      showModal('⚠️ 오류', '이메일을 입력하세요.');
      return;
    }
    if (!email.includes('@dankook.ac.kr')) {
      showModal('⚠️ 오류', '단국대학교 이메일 주소를 입력하세요.');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.EMAIL_REQUEST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        // 타이머 시작 (5분 = 300초)
        setIsCodeSent(true);
        setTimer(300);
        showModal('✅ 확인', '6자리 인증코드를 메일로 발송하였습니다. 인증코드를 입력해주세요.');
      } else {
        showModal('⚠️ 오류', data.message || '인증코드 발송에 실패했습니다.');
      }
    } catch (error) {
      console.error('Email request error:', error);
      showModal('⚠️ 오류', '서버와 통신 중 오류가 발생했습니다.');
    }
  };

  // 인증번호 검증
  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      showModal('⚠️ 오류', '6자리 인증번호를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.EMAIL_VERIFY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (data.success) {
        setCodeVerified(true);
        setTimer(0); // 타이머 멈춤
      } else {
        showModal('⚠️ 오류', data.message || '인증번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Email verify error:', error);
      showModal('⚠️ 오류', '서버와 통신 중 오류가 발생했습니다.');
    }
  };

  const validatePassword = (text) => {
    setPassword(text);

    if (text.length > 0 && text.length < 7) { return; }

    const hasLetter = /[a-zA-Z]/.test(text);
    const hasNumber = /[0-9]/.test(text);

    if (text.length >= 7 && (!hasLetter || !hasNumber)) { return; }

    if (confirmPassword) {
      setPasswordMatch(text === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    setPasswordMatch(password === text);
  };

  const handleNext = () => {
    if (!email || !email.includes('@dankook.ac.kr')) {
      showModal('⚠️ 오류', '단국대학교 이메일을 입력해주세요.');
      return;
    }
    if (!verificationCode) {
      showModal('⚠️ 오류', '인증번호를 입력해주세요.');
      return;
    }
    if (!password || password.length < 7) {
      showModal('⚠️ 오류', '비밀번호는 7자리 이상이어야 합니다.');
      return;
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      showModal('⚠️ 오류', '비밀번호는 영문과 숫자를 포함해야 합니다.');
      return;
    }
    if (!confirmPassword || password !== confirmPassword) {
      showModal('⚠️ 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    // 데이터를 전달하며 signup으로 이동
    router.push({
      pathname: '/signup',
      params: {
        email,
        verificationCode,
        password,
        confirmPassword
      }
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 105,
        backgroundColor: '#ffffff',
        zIndex: 998
      }} />

      <TouchableOpacity
        style={{ position: 'absolute', top: 60, left: 20, zIndex: 999, padding: 8 }}
        onPress={() => router.back()}
      >
        <Text style={{ fontSize: 28, color: '#000', fontWeight: 'bold' }}>←</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={{ height: 48 }} />
          <Text style={styles.title}>
            단스펙 회원가입을 위해{'\n'}이메일과 비밀번호를 입력해 주세요.
          </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="단국대 이메일 주소(@dankook.ac.kr)"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="none"
          />
          <TouchableOpacity style={styles.checkButton} onPress={handleCheckDuplicate}>
            <Text style={styles.checkButtonText}>
              {isCodeSent ? '다시 요청' : '인증 요청'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer2}>
          <TextInput
            style={styles.input}
            placeholder="인증번호 입력"
            placeholderTextColor="#999"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            autoCapitalize="none"
            editable={!codeVerified}
          />
          {codeVerified ? (
            <Text style={styles.checkmark}>✓</Text>
          ) : (
            isCodeSent && timer > 0 && (
              <>
                <Text style={styles.timerText}>{formatTimer(timer)}</Text>
                <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyCode}>
                  <Text style={styles.verifyButtonText}>확인</Text>
                </TouchableOpacity>
              </>
            )
          )}
        </View>

        <View style={styles.inputContainer3}>
          <TextInput
            style={styles.input}
            placeholder="비밀번호 입력 (7자리 이상 영문 숫자 혼합)"
            placeholderTextColor="#999"
            value={password}
            onChangeText={validatePassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="off"
            textContentType="none"
          />
        </View>

        <View style={styles.inputContainer3}>
          <TextInput
            style={styles.input}
            placeholder="새 비밀번호 확인"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="off"
            textContentType="none"
          />
        </View>
        {!passwordMatch && confirmPassword.length > 0 && (
          <Text style={styles.errorText}>비밀번호가 일치하지 않습니다</Text>
        )}
        {passwordMatch && confirmPassword.length > 0 && (
          <Text style={styles.correctText}>비밀번호가 일치합니다</Text>
        )}

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>다음</Text>
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
            {modalTitle && <Text style={styles.modalTitle}>{modalTitle}</Text>}
            {modalMessage && <Text style={styles.modalMessage}>{modalMessage}</Text>}
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
    backgroundColor: '#ffffff',
    paddingTop: 105,
    paddingLeft: 24,
    paddingRight: 30,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: '#1A1A1A',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    textAlign: 'left',
    marginTop: 10, 
    marginBottom: 30
  },
  text: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#000',
    textAlign: 'left',
    marginBottom: 5,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FF3B30',
    textAlign: 'left',
    marginTop: 20,
    marginLeft: 15
  },
  correctText: {
    fontSize: 12,
    fontWeight: '400',
    color: 'green',
    textAlign: 'left',
    marginTop: 20,
    marginLeft: 15
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  inputContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  inputContainer3: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
    marginBottom: -15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    backgroundColor: '#fff',
    paddingLeft: 8,
  },
  checkButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '600',
  },
  timerText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
  verifyButton: {
    paddingHorizontal: 12,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#3E6AF4',
    fontSize: 14,
    fontWeight: '600',
  },
  checkmark: {
    color: '#34C759',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
  },
  nextButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3E6AF4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 56,
  },
  nextButtonText: {
    color: '#3E6AF4',
    fontSize: 18,
    fontFamily: 'Pretendard-Regular',
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
