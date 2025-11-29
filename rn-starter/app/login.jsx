import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, Image, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_ENDPOINTS } from '@/config/api';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('⚠️ 로그인 실패', '이메일과 비밀번호를 입력하세요.', [
        { text: '닫기', style: 'cancel' }
      ]);
      return;
    }

    if (!email.includes('dankook.ac.kr')) {
      Alert.alert('⚠️ 로그인 실패', '유효한 단국대학교 이메일 주소를 입력하십시오.', [
        { text: '닫기', style: 'cancel' }
      ]);
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

      if (response.ok && data.success) {
        Alert.alert('👋 환영합니다', `${data.user.name}님, 로그인이 완료되었습니다.`, [
          { text: '확인', onPress: () => router.push('/home') }
        ]);
      } else {
        Alert.alert('⚠️ 로그인 실패', data.message || '이메일 또는 비밀번호가 올바르지 않습니다.', [
          { text: '확인' }
        ]);
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      Alert.alert('⚠️ 오류', '백엔드 서버가 응답하지 않습니다.', [
        { text: '확인' }
      ]);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('@/assets/images/danspecLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder="이메일을 입력하세요."
        placeholderTextColor="#666666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

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
        <ThemedText style={styles.autoLoginText}>자동 로그인</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/Home/home')}>
        <ThemedText style={styles.buttonText}>로그인</ThemedText>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <ThemedText style={styles.signupText}>계정이 아직 없으신가요? </ThemedText>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <ThemedText style={styles.signupLink}>회원 가입하기</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
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
    fontFamily: 'System',
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
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
  },
  signupText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '300',
    fontFamily: 'System',
  },
  signupLink: {
    color: '#4869EC',
    fontSize: 12,
    fontWeight: '300',
    fontFamily: 'System',
  }
});