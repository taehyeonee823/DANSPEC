import React, { useState } from "react";
import { useRouter } from 'expo-router';
import { View, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, StyleSheet, TextInput } from 'react-native'; 
import Button from '../components/Button';
import MultiplelineInput from '../components/MultiplelineInput';
import SinglelineInput from '../components/SinglelineInput';

export default function teamRecruitmentForm() {
  const router = useRouter();
  const [titleInfo, setTitleInfo] = React.useState("");
  const [roleInfo, setRoleInfo] = React.useState("");
  const [traitInfo, setTraitInfo] = React.useState("");
  const [introductionInfo, setIntroductionInfo] = React.useState("");
  const [inputs, setInputs] = useState([{id: Date.now(), value: ''}])

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
            <MultiplelineInput
                value={roleInfo}
                onChangeText={setRoleInfo}
                placeholder="모집하는 역할에 대해 상세히 작성해주세요." 
            />

            <Text style={styles.sectionTitle}>제목</Text>
            <SinglelineInput
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
            <SinglelineInput
                value={traitInfo}
                onChangeText={setTraitInfo}
                placeholder="팀이 선호하는 인재상에 대해 작성해주세요."
            />

            <Text style={styles.sectionTitle}>진행 방식 및 한 줄 소개</Text>
            <MultiplelineInput
                value={introductionInfo}
                onChangeText={setIntroductionInfo}
                placeholder="모집글에 대한 소개를 상세하게 작성해주세요."
            />

            <Button
              title="등록하기"
              onPress={() => {
                // 제출 로직 구현
                router.push('teamRecruitmentConfirmed');
              }}
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