import React, { useState } from "react";
import { useRouter } from 'expo-router';
import { View, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Button from '../../components/Button';

// 선택 가능한 활동/공모전 목록 (dummy data)
const activityOptions = [
  "단국대 X 데이터 분석 캠프",
  "캡스톤 디자인 프로젝트",
  "교내 창업 경진대회",
  "AI 개발 공모전",
  "SW 해커톤",
];

export default function teamRecruitmentForm() {
  const router = useRouter();
  const [titleInfo, setTitleInfo] = useState("");
  const [traitInfo, setTraitInfo] = useState("");
  const [introductionInfo, setIntroductionInfo] = useState("");
  
  const [selectedActivity, setSelectedActivity] = useState(null); 
  const [isPickerOpen, setIsPickerOpen] = useState(false); 
  const [inputs, setInputs] = useState([{id: Date.now(), value: ''}])

  // 드롭다운 항목 선택 핸들러
  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setIsPickerOpen(false); 
  };

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

  // 모집글 저장 함수
  const saveRecruitment = async () => {
    const roles = inputs.map(input => input.value.trim()).filter(value => value !== '');

    const newRecruitment = {
      title: titleInfo,
      tag: selectedActivity,
      description: introductionInfo,
      name: teamLeaderName,
      department: "SW융합대학",
      grade: "3학년",
      role: roles,
      trait: traitInfo,
    };

    console.log("저장할 데이터:", newRecruitment);

    // TODO: 백엔드 API 연결
    // await fetch('YOUR_API_ENDPOINT', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newRecruitment)
    // });

    router.push('/Team/teamRecruitmentConfirmed');
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
            <Text style={styles.caption}>공모전·교내·대외 활동별로 함께할 팀원을 모집해보세요.</Text>

            <Text style={styles.sectionTitle}>연결할 활동 / 공모전</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity 
                style={styles.pickerField}
                onPress={() => setIsPickerOpen(!isPickerOpen)}
              >
                <Text style={selectedActivity ? styles.pickerValue : styles.pickerPlaceholder}>
                  {selectedActivity || "활동/공모전을 선택해주세요."}
                </Text>
                <Text style={styles.arrow}>{isPickerOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isPickerOpen && (
                <View style={styles.pickerList}>
                  {activityOptions.map((activity) => (
                    <TouchableOpacity
                      key={activity}
                      style={styles.pickerItem}
                      onPress={() => handleActivitySelect(activity)}
                    >
                      <Text style={styles.pickerItemText}>{activity}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

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

  pickerContainer: {
    zIndex: 10, 
    marginBottom: 10,
  },
  pickerField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  pickerPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  pickerValue: {
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  pickerList: {
    // 드롭다운 목록
    position: 'absolute',
    top: 48, // pickerField 높이만큼 아래에 위치
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: -1, // 경계선 겹치기
    maxHeight: 200, // 최대 높이 설정
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  pickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#333',
  }, 
  
  // 기타 입력 필드 스타일
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
  }
});