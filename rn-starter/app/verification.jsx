import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, Modal } from 'react-native';
import { useRouter } from 'expo-router';

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

  const handleCheckDuplicate = () => {
    if (!email) {
      showModal('⚠️ 오류', '이메일을 입력하세요.');
      return;
    }
    if (!email.includes('@dankook.ac.kr')) {
      showModal('⚠️ 오류', '단국대학교 이메일 주소를 입력하세요.');
      return;
    }
    showModal('✅ 확인', '6자리 인증코드를 메일로 발송하였습니다. 인증코드를 입력해주세요.');
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
            <Text style={styles.checkButtonText}>인증 요청</Text>
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
          />
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
  },
  inputContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
    marginTop: 12,
  },
  inputContainer3: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
    marginBottom: -15
  },
  input: {
    flex: 1,
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  checkButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#1A1A1A',
    fontSize: 14,
    marginTop: -2,
    fontWeight: '600',
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
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 16,
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
