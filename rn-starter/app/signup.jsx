import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, Modal, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { API_ENDPOINTS } from '@/config/api';

export default function SignUpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // params에서 개별 값 추출 (의존성 배열용)
  const pEmail = params.email;
  const pCode = params.verificationCode;
  const pPass = params.password;
  const pConfirm = params.confirmPassword;

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    console.log('=== verification.jsx로부터 받은 params ===');
    console.log('email:', pEmail);
    console.log('verificationCode:', pCode);
    console.log('password:', pPass);
    console.log('confirmPassword:', pConfirm);

    if (pEmail) setEmail(pEmail);
    if (pCode) setVerificationCode(pCode);
    if (pPass) setPassword(pPass);
    if (pConfirm) setConfirmPassword(pConfirm);
  }, [pEmail, pCode, pPass, pConfirm]);

  const [campus, setCampus] = useState('');
  const [college, setCollege] = useState('');
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [major, setMajor] = useState('');
  const [showMajorModal, setShowMajorModal] = useState(false);
  const [grade, setGrade] = useState('');
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [interestJobPrimary, setInterestJobPrimary] = useState('');
  const [interestJobSecondary, setInterestJobSecondary] = useState('');
  const [interestJobTertiary, setInterestJobTertiary] = useState('');
  const [tagline, setTagline] = useState('');

  const grades = ['1', '2', '3', '4', '5', '6'];

  const jukjeonColleges = [
    '문과대학','법과대학','경영경제대학','사회과학대학','공과대학','SW융합대학','사범대학','음악·예술대학'
  ];
  const cheonanColleges = [
    '외국어대학','공공인재대학','과학기술대학','바이오융합대학','보건과학대학','의과대학','치과대학','약학대학','간호대학','스포츠과학대학','예술대학'
  ];
  const collegeMajorsJukjeon = {
    '문과대학': ['국어국문학과', '사학과', '철학과', '영미인문학과'],
    '법과대학': ['법학과'],
    '사회과학대학': ['정치외교학과', '행정학과', '도시계획·부동산학부', '미디어커뮤니케이션학과'],
    '경영경제대학': ['경영학과','경제학과','무역학과','글로벌경영학과','산업경영학과'],
    '공과대학': ['전자전기공학과', '융합반도체공학과','기계공학과','화학공학과','고분자공학부','토목환경공학과','건축학부'],
    'SW융합대학': ['소프트웨어학과','컴퓨터공학과','모바일시스템공학과','사이버보안학과','통계데이터사이언스학과','SW융합학부'],
    '사범대학': ['수학교육과','과학교육과','체육교육과','한문교육과','특수교육과'],
    '음악·예술대학': ['도예과', '디자인학부', '공연영화학부','무용과','음악학부'],
  };

  const collegeMajorsCheonan = {
    '외국어대학': ['아시아중동학부', '유럽중남미학부', '영어과' ,'글로벌한국어과'],
    '공공인재대학': ['공공정책학과', '식품자원경제학과','사회복지학과','해병대군사학과'],
    '과학기술대학': ['수학과','물리학과','화학과','식품영양학과','신소재공학과','에너지공학과','식품공학과','경영공학과','제약공학과'],
    '바이오융합대학': ['생명자원학부', '의생명과학부', '식품공학과','코스메디컬소재학과'],
    '의과대학': ['의예과', '의학과'],
    '치과대학': ['치의예과', '치의학과'],
    '약학대학': ['약학과'],
    '간호대학': ['간호학과'],
    '보건과학대학' : ['임상병리학과','물리치료학과','보건행정학과','치위생학과','심리치료학과'],
    '스포츠과학대학': ['생활체육학과', '스포츠경영학과', '국제스포츠학부'],
    '예술대학': ['문예창작과', '미술학부', '뉴뮤직학부'],
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
      router.push('/login');
    }
  };

  const handleSignup = async () => {
    // 디버깅: 모든 필드 값 출력
    console.log('=== 회원가입 데이터 검증 시작 ===');
    console.log('email:', email);
    console.log('password:', password);
    console.log('name:', name);
    console.log('campus:', campus);
    console.log('college:', college);
    console.log('major:', major);
    console.log('grade:', grade);
    console.log('interestJobPrimary:', interestJobPrimary);
    console.log('interestJobSecondary:', interestJobSecondary);
    console.log('interestJobTertiary:', interestJobTertiary);
    console.log('tagline:', tagline);

    // 각 필수 항목 개별 검증
    if (!email) {
      console.log('검증 실패: 이메일 없음');
      showModal('⚠️ 오류', '이메일 정보가 없습니다. 이전 단계로 돌아가주세요.');
      return;
    }
    if (!password) {
      console.log('검증 실패: 비밀번호 없음');
      showModal('⚠️ 오류', '비밀번호 정보가 없습니다. 이전 단계로 돌아가주세요.');
      return;
    }
    if (!name) {
      console.log('검증 실패: 이름 없음');
      showModal('⚠️ 오류', '이름을 입력해주세요.');
      return;
    }
    if (!campus) {
      console.log('검증 실패: 캠퍼스 미선택');
      showModal('⚠️ 오류', '소속 캠퍼스를 선택해주세요.');
      return;
    }
    if (!college) {
      console.log('검증 실패: 단과대학 미선택');
      showModal('⚠️ 오류', '단과대학을 선택해주세요.');
      return;
    }
    if (!major) {
      console.log('검증 실패: 학과 미선택');
      showModal('⚠️ 오류', '학과를 선택해주세요.');
      return;
    }
    if (!grade) {
      console.log('검증 실패: 학년 미선택');
      showModal('⚠️ 오류', '학년을 선택해주세요.');
      return;
    }
    if (!interestJobPrimary) {
      console.log('검증 실패: 희망 직무 1순위 없음');
      showModal('⚠️ 오류', '희망 직무 1순위를 입력해주세요.');
      return;
    }
    if (!interestJobSecondary) {
      console.log('검증 실패: 희망 직무 2순위 없음');
      showModal('⚠️ 오류', '희망 직무 2순위를 입력해주세요.');
      return;
    }
    if (!interestJobTertiary) {
      console.log('검증 실패: 희망 직무 3순위 없음');
      showModal('⚠️ 오류', '희망 직무 3순위를 입력해주세요.');
      return;
    }

    console.log('✓ 모든 필드 검증 통과');

    try {
      const signupData = {
        email: String(email),
        password: String(password),
        passwordConfirm: String(confirmPassword),
        name: String(name),
        campus: String(campus),
        college: String(college),
        major: String(major),
        grade: String(grade),
        interestJobPrimary: String(interestJobPrimary),
        interestJobSecondary: String(interestJobSecondary),
        interestJobTertiary: String(interestJobTertiary),
        tagline: tagline ? String(tagline) : '',
      };

      console.log('=== API 요청 데이터 ===');
      console.log('Endpoint:', API_ENDPOINTS.SIGNUP);
      console.log('Request body:', JSON.stringify(signupData, null, 2));

      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(signupData),
      });

      console.log('=== API 응답 ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);

      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));

      if (data.success) {
        console.log('✓ 회원가입 성공');
        router.push('/signupConfirmed');
      } else {
        console.log('✗ 회원가입 실패:', data.message);
        showModal('⚠️ 오류', data.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      showModal('⚠️ 오류', '서버와 통신 중 오류가 발생했습니다.');
    }
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
          style={{ position: 'absolute', top:60, left: 20, zIndex: 999, padding: 8 }}
          onPress={() => router.back()}
        >
          <Text style={{ fontSize: 28, color: '#000', fontWeight: 'bold' }}>←</Text>
      </TouchableOpacity>

      <ScrollView style={styles.container}
        contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.subtitle}>내 정보 입력을 완료해주세요. {'\n'}드림이가 딱 맞는 활동을 추천해 드릴게요.</Text>

      <Text style={styles.text}>이름</Text>
    <View style={styles.inputContainer3}>
      <TextInput
          style={styles.input}
          placeholder="이름을 입력해 주세요"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
      </View>

    <Text style={styles.text}>소속 캠퍼스</Text>
    <View style={styles.campusButtonContainer}>
      <TouchableOpacity
        style={[
          styles.campusButton,
          campus === 'JUKJEON' && styles.campusButtonSelected
        ]}
        onPress={() => {
          setCampus('JUKJEON');
          setCollege('');
          setMajor('');
        }}
      >
        <Text style={[
          styles.campusButtonText,
          campus === 'JUKJEON' && styles.campusButtonTextSelected
        ]}> 죽전
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.campusButton,
          campus === 'CHEONAN' && styles.campusButtonSelected
        ]}
        onPress={() => {
          setCampus('CHEONAN');
          setCollege('');
          setMajor('');
        }}
      >
        <Text style={[
          styles.campusButtonText,
          campus === 'CHEONAN' && styles.campusButtonTextSelected
        ]}> 천안
        </Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.text}>소속 학과</Text>
        <View style={styles.majorContainer}>
          <View style={styles.majorWrapper}>
            <TouchableOpacity
              style={styles.departmentSelector}
              onPress={() => {
                if (campus) {
                  setShowCollegeModal(!showCollegeModal);
                }
              }}
            >
              <Text style={[
                styles.departmentSelectorText,
                !college && styles.departmentPlaceholder
              ]}>
                {college || '단과대학 선택'}
              </Text>
              <Text style={styles.dropdownIcon}>
                {showCollegeModal ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {showCollegeModal && campus && (
              <ScrollView style={styles.dropdownList} nestedScrollEnabled={true}>
                {(campus === 'JUKJEON' ? jukjeonColleges : cheonanColleges).map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.departmentOption}
                    onPress={() => {
                      setCollege(item);
                      setShowCollegeModal(false);
                      setMajor(''); // 단과대학 변경 시 학과 초기화
                    }}
                  >
                    <Text style={styles.departmentOptionText}>
                      {item}
                    </Text>
                    {college === item && (
                      <Text style={styles.checkmark}>✓</Text>
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
                const majors = campus === 'JUKJEON' ? collegeMajorsJukjeon : collegeMajorsCheonan;
                if (college && majors[college]) {
                  setShowMajorModal(!showMajorModal);
                }
              }}
            >
              <Text style={[
                styles.departmentSelectorText,
                !major && styles.departmentPlaceholder
              ]}>
                {major || '학과 선택'}
              </Text>
              <Text style={styles.dropdownIcon}>
                {showMajorModal ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {showMajorModal && college && (
              <ScrollView style={styles.dropdownList} nestedScrollEnabled={true}>
                {(campus === 'JUKJEON' ? collegeMajorsJukjeon[college] : collegeMajorsCheonan[college])?.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.departmentOption}
                    onPress={() => {
                      setMajor(item);
                      setShowMajorModal(false);
                    }}
                  >
                    <Text style={styles.departmentOptionText}>
                      {item}
                    </Text>
                    {major === item && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
    <Text style={styles.text}>학년</Text>
    <View style={styles.gradeContainer}>
      <TouchableOpacity
        style={styles.gradeSelector}
        onPress={() => setShowGradeModal(!showGradeModal)}
      >
        <Text style={[
          styles.departmentSelectorText,
          !grade && styles.departmentPlaceholder
        ]}>
          {grade || '학년 선택'}
        </Text>
        <Text style={styles.dropdownIcon}>
          {showGradeModal ? '▲' : '▼'}
        </Text>
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
              <Text style={styles.departmentOptionText}>
                {item}
              </Text>
              {grade === item && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
    <Text style={styles.text}>희망 직무 1순위</Text>
    <View style={styles.inputContainer3}>
      <TextInput
          style={styles.input}
          placeholder="희망 직무를 입력해주세요"
          placeholderTextColor="#999"
          value={interestJobPrimary}
          onChangeText={setInterestJobPrimary}
        />
      </View>
      <Text style={styles.text}>희망 직무 2순위</Text>
    <View style={styles.inputContainer3}>
      <TextInput
          style={styles.input}
          placeholder="희망 직무를 입력해주세요"
          placeholderTextColor="#999"
          value={interestJobSecondary}
          onChangeText={setInterestJobSecondary}
        />
      </View>
      <Text style={styles.text}>희망 직무 3순위</Text>
    <View style={styles.inputContainer3}>
      <TextInput
          style={styles.input}
          placeholder="희망 직무를 입력해주세요"
          placeholderTextColor="#999"
          value={interestJobTertiary}
          onChangeText={setInterestJobTertiary}
        />
      </View> 

    <Text style={styles.text}>한 줄 소개</Text>
    <View style={styles.inputContainer3}>
      <TextInput
        style={[styles.input2, styles.introInput]}
        placeholder="자신을 소개해주세요 한 줄이면 충분합니다!"
        placeholderTextColor="#999"
        value={tagline}
        onChangeText={setTagline}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
    </View>

    <TouchableOpacity
      style={styles.signupButton}
      onPress={handleSignup}
    >
      <Text style={styles.signupButtonText}>가입하기</Text>
    </TouchableOpacity>

      </ScrollView>

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
        backgroundColor: '#ffffff',
  },
  contentContainer: {
        padding: 20,
        paddingBottom: 0,
        zIndex: 900
    },
  scrollViewContent: {
    paddingTop: 85,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    textAlign: 'left',
    marginTop: 30,
    marginBottom: 20
  },
   text: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    textAlign: 'left',
    paddingBottom: 12,
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
  inputContainer3: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 8,
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    backgroundColor: '#fff',
    marginBottom: 32,
  },
  input2: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#3E6AF433',
    paddingHorizontal: 8,
    fontSize: 16,
    borderRadius: 8,
    fontFamily: 'Pretendard-Regular',
    backgroundColor: '#fff',
    marginBottom: 32,
  },
  introInput: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
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
    width: '100%',
    gap: 10,
  },
  campusButton: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#fff',
  },
  campusButtonSelected: {
    backgroundColor: '#3E6AF4',
    borderColor: '#3E6AF4',
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
    width: '100%',
    gap: 10,
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
    borderColor: '#3E6AF433',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 32,
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
    width: '48%',
    height: 45,
    borderWidth: 1,
    borderColor: '#3E6AF433',
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
    width: '100%',
    height: 50,
    backgroundColor: '#3E6AF4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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