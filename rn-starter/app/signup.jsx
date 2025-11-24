import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Alert, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_ENDPOINTS } from '@/config/api';


export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [name, setName] = useState('');
  const [campus, setCampus] = useState('');
  const [department, setDepartment] = useState('');
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [major, setMajor] = useState('');
  const [showMajorModal, setShowMajorModal] = useState(false);
  const [grade, setGrade] = useState('');
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [introduction, setIntroduction] = useState('');

  const grades = ['1', '2', '3', '4', '5', '6'];

  const jukjeonDepartments = [
    '문과대학','법과대학','경영경제대학','사회과학대학','공과대학','SW융합대학','사범대학','음악·예술대학'
  ];
   const cheonanDepartments = [
    '외국어대학','공공인재대학','과학기술대학','바이오융합대학','보건과학대학','의·약학계열','스포츠과학대학','예술대학'
  ];
  const departmentMajorsJukjeon = {
    '문과대학': ['국어국문학과', '사학과', '철학과', '영미인문학과'],
    '법과대학': ['법학과'],
    '사회과학대학': ['정치외교학과', '행정학과', '도시계획·부동산학부', '미디어커뮤니케이션학과'],
    '경영경제대학': ['경영학과','경제학과','무역학과','글로벌경영학과','산업경영학과'],
    '공과대학': ['전자전기공학과', '융합반도체공학과','기계공학과','화학공학과','고분자공학부','토목환경공학과','건축학부'],
    'SW융합대학': ['소프트웨어학과','컴퓨터공학과','모바일시스템공학과','사이버보안학과','통계데이터사이언스학과','SW융합학부'],
    '사범대학': ['수학교육과','과학교육과','체육교육과','한문교육과','특수교육과'],
    '음악·예술대학': ['도예과', '디자인학부', '공연영화학부','무용과','음악학부'],
  };

  const departmentMajorscheonan = {
    '외국어대학': [],
    '공공인재대학': [''],
    '과학기술대학': ['수학과','물리학과','화학과','식품영양학과','신소재공학과','에너지공학과','식품공학과','경영공학과','제약공학과'],
    '바이오융합대학': [''],
    '의·약학계열': ['의과대학','치과대학','약학대학','간호대학'],
    '스포츠과학대학': [],
    '예술대학': [''],
  };

  const handleCheckDuplicate = () => {
    if (!email) {
      Alert.alert('⚠️ 오류', '이메일을 입력하세요.', [
        { text: '닫기', style: 'cancel' }
      ]);
      return;
    }
    if (!email.includes('@dankook.ac.kr')) {
      Alert.alert('⚠️ 오류', '단국대학교 이메일 주소를 입력하세요.', [
        { text: '닫기', style: 'cancel' }
      ]);
      return;
    }
    Alert.alert('✅ 확인', '4자리 인증코드를 메일로 발송하였습니다. 인증코드를 입력해주세요.', [
      { text: '확인', style: 'default' }
    ]);
  };

  const validatePassword = (text) => {
    setPassword(text);

    if (text.length > 0 && text.length < 7) {
      // 길이 부족
      return;
    }
  const hasLetter = /[a-zA-Z]/.test(text);

  const hasNumber = /[0-9]/.test(text);
    if (text.length >= 7 && (!hasLetter || !hasNumber)) {
      return;
    }
    if (confirmPassword) {
      setPasswordMatch(text === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    // 비밀번호 일치 여부 확인
    setPasswordMatch(password === text);
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image
          source={require('@/assets/images/undo.png')}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.title}>반가워요 👋 </ThemedText>
        <ThemedText style={styles.subtitle}>회원가입을 하고 단스펙의 다양한 서비스를 만나보세요!</ThemedText>

      <ThemedText style={styles.text}>* 아이디</ThemedText>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="단국대 이메일 주소(@dankook.ac.kr)"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TouchableOpacity style={styles.checkButton} onPress={handleCheckDuplicate}>
          <ThemedText style={styles.checkButtonText}>인증</ThemedText>
        </TouchableOpacity>
      </View>
    <ThemedText style={styles.text}>* 인증번호</ThemedText>
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
    <ThemedText style={styles.text}>* 비밀번호</ThemedText>
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

    <ThemedText style={styles.text}>* 비밀번호 재확인</ThemedText>
    <View style={styles.inputContainer3}>
      <TextInput
          style={styles.input}
          placeholder="비밀번호 재입력"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="off"
          textContentType="none"
        />
      </View>
    {!passwordMatch && confirmPassword.length >= 0 && (
      <ThemedText style={styles.errorText}>비밀번호가 일치하지 않습니다</ThemedText>
    )}
    {passwordMatch && (
      <ThemedText style={styles.correctText}>비밀번호가 일치합니다</ThemedText>
    )}
     <ThemedText style={styles.text}>* 이름</ThemedText>
    <View style={styles.inputContainer3}>
      <TextInput
          style={styles.input}
          placeholder="이름 입력"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
      </View>

    <ThemedText style={styles.text}>* 소속 캠퍼스</ThemedText>
    <View style={styles.campusButtonContainer}>
      <TouchableOpacity
        style={[
          styles.campusButton,
          campus === '죽전' && styles.campusButtonSelected
        ]}
        onPress={() => {
          setCampus('죽전');
          setDepartment('');
          setMajor('');
        }}
      >
        <ThemedText style={[
          styles.campusButtonText,
          campus === '죽전' && styles.campusButtonTextSelected
        ]}> 죽전
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.campusButton,
          campus === '천안' && styles.campusButtonSelected
        ]}
        onPress={() => {
          setCampus('천안');
          setDepartment('');
          setMajor('');
        }}
      >
        <ThemedText style={[
          styles.campusButtonText,
          campus === '천안' && styles.campusButtonTextSelected
        ]}> 천안
        </ThemedText>
      </TouchableOpacity>
    </View>

    <ThemedText style={styles.text}>* 소속 학과</ThemedText>
        <View style={styles.majorContainer}>
          <View style={styles.majorWrapper}>
            <TouchableOpacity
              style={styles.departmentSelector}
              onPress={() => {
                if (campus) {
                  setShowDepartmentModal(!showDepartmentModal);
                }
              }}
            >
              <ThemedText style={[
                styles.departmentSelectorText,
                !department && styles.departmentPlaceholder
              ]}>
                {department || '단과대학 선택'}
              </ThemedText>
              <ThemedText style={styles.dropdownIcon}>
                {showDepartmentModal ? '▲' : '▼'}
              </ThemedText>
            </TouchableOpacity>

            {showDepartmentModal && campus && (
              <ScrollView style={styles.dropdownList} nestedScrollEnabled={true}>
                {(campus === '죽전' ? jukjeonDepartments : cheonanDepartments).map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.departmentOption}
                    onPress={() => {
                      setDepartment(item);
                      setShowDepartmentModal(false);
                      setMajor(''); // 단과대학 변경 시 학과 초기화
                    }}
                  >
                    <ThemedText style={styles.departmentOptionText}>
                      {item}
                    </ThemedText>
                    {department === item && (
                      <ThemedText style={styles.checkmark}>✓</ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.majorWrapper}>
            <TouchableOpacity
              style={styles.departmentSelector}
              onPress={() => {
                const majors = campus === '죽전' ? departmentMajorsJukjeon : departmentMajorscheonan;
                if (department && majors[department]) {
                  setShowMajorModal(!showMajorModal);
                }
              }}
            >
              <ThemedText style={[
                styles.departmentSelectorText,
                !major && styles.departmentPlaceholder
              ]}>
                {major || '학과 선택'}
              </ThemedText>
              <ThemedText style={styles.dropdownIcon}>
                {showMajorModal ? '▲' : '▼'}
              </ThemedText>
            </TouchableOpacity>

            {showMajorModal && department && (
              <ScrollView style={styles.dropdownList} nestedScrollEnabled={true}>
                {(campus === '죽전' ? departmentMajorsJukjeon[department] : departmentMajorscheonan[department])?.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.departmentOption}
                    onPress={() => {
                      setMajor(item);
                      setShowMajorModal(false);
                    }}
                  >
                    <ThemedText style={styles.departmentOptionText}>
                      {item}
                    </ThemedText>
                    {major === item && (
                      <ThemedText style={styles.checkmark}>✓</ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
    <ThemedText style={styles.text}>* 학년</ThemedText>
    <View style={styles.gradeContainer}>
      <TouchableOpacity
        style={styles.gradeSelector}
        onPress={() => setShowGradeModal(!showGradeModal)}
      >
        <ThemedText style={[
          styles.departmentSelectorText,
          !grade && styles.departmentPlaceholder
        ]}>
          {grade || '학년 선택'}
        </ThemedText>
        <ThemedText style={styles.dropdownIcon}>
          {showGradeModal ? '▲' : '▼'}
        </ThemedText>
      </TouchableOpacity>

      {showGradeModal && (
        <ScrollView style={styles.gradeDropdownList} nestedScrollEnabled={true}>
          {grades.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.departmentOption}
              onPress={() => {
                setGrade(item);
                setShowGradeModal(false);
              }}
            >
              <ThemedText style={styles.departmentOptionText}>
                {item}
              </ThemedText>
              {grade === item && (
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>

    <ThemedText style={styles.text}>* 관심 직무와 간단 소개</ThemedText>
    <View style={styles.inputContainer3}>
      <TextInput
        style={[styles.input, styles.introInput]}
        placeholder="자신을 소개해주세요 한 줄이면 충분합니다!"
        placeholderTextColor="#999"
        value={introduction}
        onChangeText={setIntroduction}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
    </View>

    <TouchableOpacity
      style={styles.signupButton}
      onPress={async () => {

        if (!email || !password || !confirmPassword || !name || !campus || !department || !major || !grade || !introduction) {
          Alert.alert('⚠️ 경고', '모든 정보를 입력하세요.', [{ text: '확인' }]);
          return;
        }

        if (password !== confirmPassword) {
          Alert.alert('⚠️ 경고', '비밀번호가 일치하지 않습니다.', [{ text: '확인' }]);
          return;
        }

        try {
          // 회원가입 API 호출
          // iOS 시뮬레이터나 Android 에뮬레이터에서 로컬 서버에 접근
          const response = await fetch(API_ENDPOINTS.SIGNUP, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
              name,
              campus,
              department,
              major,
              grade: grade === '선택안함' || !grade ? null : grade,
              introduction,
            }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            Alert.alert('👋 완료', '회원가입이 완료되었습니다!', [
              { text: '확인', onPress: () => router.back() }
            ]);
          } else {
            Alert.alert('⚠️ 오류', data.message || '회원가입에 실패했습니다.', [{ text: '확인' }]);
          }
        } catch (error) {
          console.error('회원가입 오류:', error);
          Alert.alert('⚠️ 오류', '서버와 통신 중 오류가 발생했습니다.', [{ text: '확인' }]);
        }
      }}
    >
      <ThemedText style={styles.signupButtonText}>가입하기</ThemedText>
    </TouchableOpacity>

      </ScrollView>
    </ThemedView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#lightgrey',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 85,
    paddingLeft: 30,
    paddingRight: 0,
    paddingBottom: 150,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  backIcon: {
    width: 20,
    height: 20,
    marginBottom: 20
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    textAlign: 'left',
    marginTop: 5,
    marginBottom: 30
  },
   text: {
    fontSize: 14,
    fontWeight: '300',
    color: '#000',
    textAlign: 'left',
    marginBottom: 5,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FF3B30',
    textAlign: 'left',
    marginTop: -10,
    marginBottom: 15,
  },
  correctText: {
    fontSize: 12,
    fontWeight: '400',
    color: 'green',
    textAlign: 'left',
    marginTop: -10,
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 15,
  },
  inputContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
    marginBottom: 15,
  },
  inputContainer3: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  introInput: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  input2: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  checkButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 14,
    marginTop: -2,
    fontWeight: '600',
  },
  campusButtonContainer: {
    flexDirection: 'row',
    width: '90%',
    marginBottom: 15,
    gap: 10,
  },
  campusButton: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  campusButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  campusButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  campusButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  majorContainer: {
    flexDirection: 'row',
    width: '90%',
    gap: 10,
    marginBottom: 15,
  },
  majorWrapper: {
    flex: 1,
  },
  departmentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  departmentSelectorText: {
    fontSize: 16,
    color: '#000',
  },
  departmentPlaceholder: {
    color: '#999',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  dropdownList: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: -10,
    marginBottom: 15,
    maxHeight: 250,
  },
  departmentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  departmentOptionText: {
    fontSize: 16,
    color: '#000',
  },
  checkmark: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  gradeContainer: {
    width: '100%',
    marginBottom: 15,
  },
  gradeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '45%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  gradeDropdownList: {
    width: '45%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: -10,
    marginBottom: 15,
    maxHeight: 150,
  },
  signupButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});