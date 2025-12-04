import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, Modal, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { API_ENDPOINTS } from '@/config/api';


export default function SignUpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

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
    if (params.email) setEmail(params.email);
    if (params.verificationCode) setVerificationCode(params.verificationCode);
    if (params.password) setPassword(params.password);
    if (params.confirmPassword) setConfirmPassword(params.confirmPassword);
  }, [params]);
  const [campus, setCampus] = useState('');
  const [department, setDepartment] = useState('');
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [major, setMajor] = useState('');
  const [showMajorModal, setShowMajorModal] = useState(false);
  const [grade, setGrade] = useState('');
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [firstJobPreference, setFirstJobPreference] = useState('');
  const [secondJobPreference, setSecondJobPreference] = useState('');
  const [thirdJobPreference, setThirdJobPreference] = useState('');
  const [introduction, setIntroduction] = useState('');

  const grades = ['1', '2', '3', '4'];

  const jukjeonDepartments = [
    '문과대학','법과대학','경영경제대학','사회과학대학','공과대학','SW융합대학','사범대학','음악·예술대학'
  ];
  const cheonanDepartments = [
    '외국어대학','공공인재대학','과학기술대학','바이오융합대학','보건과학대학','의과대학','치과대학','약학대학','간호대학','스포츠과학대학','예술대학'
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

  const handleSignup = () => {
    if (!name || !campus || !department || !major || !grade || !firstJobPreference || !secondJobPreference || !thirdJobPreference) {
      showModal('⚠️ 오류', '필수 항목들을 입력해주세요.');
      return;
    }

    // 유효성 검사 통과 시 modUserInfoConfirmed로 이동
    router.push('./modUserInfoConfirmed');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View
        style={{
          marginTop: 70,
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          position: 'relative',
        }}
      >
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
          회원정보 수정
        </Text>
      </View>

      <ScrollView style={styles.container}
        contentContainerStyle={styles.scrollViewContent}>

      <Text style={styles.text}>* 이름</Text>
    <View style={styles.inputContainer3}>
      <TextInput
          style={styles.input}
          placeholder="이름을 입력해 주세요"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
      </View>

    <Text style={styles.text}>* 소속 캠퍼스</Text>
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
        <Text style={[
          styles.campusButtonText,
          campus === '죽전' && styles.campusButtonTextSelected
        ]}> 죽전
        </Text>
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
        <Text style={[
          styles.campusButtonText,
          campus === '천안' && styles.campusButtonTextSelected
        ]}> 천안
        </Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.text}>* 소속 학과</Text>
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
              <Text style={[
                styles.departmentSelectorText,
                !department && styles.departmentPlaceholder
              ]}>
                {department || '단과대학 선택'}
              </Text>
              <Text style={styles.dropdownIcon}>
                {showDepartmentModal ? '▲' : '▼'}
              </Text>
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
                    <Text style={styles.departmentOptionText}>
                      {item}
                    </Text>
                    {department === item && (
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
                const majors = campus === '죽전' ? departmentMajorsJukjeon : departmentMajorscheonan;
                if (department && majors[department]) {
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
    <Text style={styles.text}>* 학년</Text>
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
    <Text style={styles.text}>* 희망 직무 1순위</Text>
    <View style={styles.inputContainer3}>
      <TextInput
          style={styles.input}
          placeholder="희망 직무를 입력해주세요"
          placeholderTextColor="#999"
          value={firstJobPreference}
          onChangeText={setFirstJobPreference}
        />
      </View>
      <Text style={styles.text}>* 희망 직무 2순위</Text>
    <View style={styles.inputContainer3}>
      <TextInput
          style={styles.input}
          placeholder="희망 직무를 입력해주세요"
          placeholderTextColor="#999"
          value={secondJobPreference}
          onChangeText={setSecondJobPreference}
        />
      </View>
      <Text style={styles.text}>* 희망 직무 3순위</Text>
    <View style={styles.inputContainer3}>
      <TextInput
          style={styles.input}
          placeholder="희망 직무를 입력해주세요"
          placeholderTextColor="#999"
          value={thirdJobPreference}
          onChangeText={setThirdJobPreference}
        />
      </View>

    <Text style={styles.text}>간단 소개</Text>
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
      onPress={handleSignup}
    >
      <Text style={styles.signupButtonText}>변경하기</Text>
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
    paddingTop: 10,
    paddingLeft: 30,
    paddingRight: 0,
    paddingBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    textAlign: 'left',
    marginTop: 30,
    marginBottom: 20
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
    backgroundColor: '#4869EC',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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