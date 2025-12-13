import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Modal, Image, View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_ENDPOINTS } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCheckingAutoLogin, setIsCheckingAutoLogin] = useState(true);

  const showModal = (title, message, success = false) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsSuccess(success);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  // 자동 로그인 확인
  useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        const autoLoginEnabled = await AsyncStorage.getItem('autoLogin');
        const accessToken = await AsyncStorage.getItem('accessToken');
        const savedEmail = await AsyncStorage.getItem('savedEmail');

        if (autoLoginEnabled === 'true' && accessToken) {
          console.log('자동 로그인 시도 중...');

          // 토큰이 유효한지 확인
          const response = await fetch(API_ENDPOINTS.USER_ME, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            console.log('자동 로그인 성공');
            router.replace('/Home/home');
            return;
          } else {
            // 토큰이 만료되었으면 삭제
            console.log('토큰이 만료되었습니다.');
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            await AsyncStorage.removeItem('autoLogin');
          }
        }

        // 저장된 이메일이 있으면 입력 필드에 표시
        if (savedEmail) {
          setEmail(savedEmail);
        }
      } catch (error) {
        console.error('자동 로그인 확인 오류:', error);
      } finally {
        setIsCheckingAutoLogin(false);
      }
    };

    checkAutoLogin();
  }, []);

  const handleEmailChange = (text) => {
    setEmail(text);
    if (text.length > 0 && !text.includes('dankook.ac.kr')) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showModal('⚠️ 로그인 실패', '이메일과 비밀번호를 입력하세요.');
      return;
    }

    if (!email.includes('dankook.ac.kr')) {
      showModal('⚠️ 로그인 실패', '유효한 단국대학교 \n이메일 주소를 입력해주세요.');
      return;
    }
  
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      const data = await response.json();
      
      // 디버깅용 로그
      console.log('=== 로그인 응답 ===');
      console.log('status:', response.status);
      console.log('data:', JSON.stringify(data, null, 2));
      console.log('accessToken:', data.data?.accessToken);
      console.log('==================');
  
      if (response.ok && data.success) {
        // 토큰 저장
        if (data.data?.accessToken && data.data?.refreshToken) {
          await AsyncStorage.setItem('accessToken', data.data.accessToken);
          await AsyncStorage.setItem('refreshToken', data.data.refreshToken);

          // 자동 로그인 설정 저장
          if (autoLogin) {
            await AsyncStorage.setItem('autoLogin', 'true');
            await AsyncStorage.setItem('savedEmail', email);
          }
        }

        // 홈으로 이동
        router.replace('/Home/home');
        // 자동 로그인 체크된 경우에만 AsyncStorage에 저장
        if (autoLogin) {
          if (data.token) {
            await AsyncStorage.setItem('authToken', data.token);
          }
          await AsyncStorage.setItem('userEmail', data.user.email || email);
        }
            } else {
        showModal('⚠️ 로그인 실패', data.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
            }

    } catch (error) {
      console.error('로그인 오류:', error);
      showModal('⚠️ 오류', '백엔드 서버가 응답하지 않습니다.');
    }
  };

  // 자동 로그인 확인 중일 때는 빈 화면 표시
  if (isCheckingAutoLogin) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 16, color: '#666' }}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/danspecLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={{ width: '100%' }}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, emailError && styles.inputError, emailError && { paddingRight: 45 }]}
            placeholder="이메일을 입력하세요."
            placeholderTextColor="#666666"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          {emailError && (
            <Image
              source={require('@/assets/images/error.png')}
              style={styles.errorIcon}
              resizeMode="contain"
            />
          )}
        </View>
        {emailError && (
          <Text style={styles.errorText}>유효한 단국대학교 이메일을 입력하세요.</Text>
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="비밀번호를 입력하세요."
        placeholderTextColor="#666666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
      />

      <TouchableOpacity
        style={styles.autoLoginContainer}
        onPress={() => setAutoLogin(!autoLogin)}
        activeOpacity={0.5}
      >
        <View style={styles.checkbox}>
          {autoLogin && <View style={styles.checkboxChecked} />}
        </View>
        <Text style={styles.autoLoginText}>자동 로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>계정이 아직 없으신가요? </Text>
        <TouchableOpacity onPress={() => router.push('/verification')}>
          <Text style={styles.signupLink}>회원가입하기</Text>
        </TouchableOpacity>
      </View>

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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  logo: {
    width: '40%',
    marginTop: -150,
    marginBottom: -100,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOpacity: 1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 14,
    backgroundColor:'#FAFAFA'
  },
  inputError: {
    borderColor: '#FF0000',
    borderWidth: 2,
  },
  errorIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    width: 20,
    height: 20,
  },
  errorText: {
    color: '#FF0000',
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    marginTop: -10,
    marginLeft: 5,
  },
  autoLoginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#4869EC',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 10,
    height: 10,
    backgroundColor: '#4869EC',
    borderRadius: 2,
  },
  autoLoginText: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4869EC',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
  },
  signupText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '300',
    fontFamily: 'Pretendard-Regular',
  },
  signupLink: {
    color: '#4869EC',
    fontSize: 14,
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
    marginTop:5,
    marginBottom: 10,
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