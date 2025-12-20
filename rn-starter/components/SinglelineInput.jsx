import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

export default function DynamicInputByFocus({ value, onChangeText, placeholder, editable = true, ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  // 1. 포커스 상태에 따라 색상을 결정합니다.
  // editable이 false면 (읽기 전용) 항상 검은색으로 표시
  const inputStyle = {
    ...styles.input,
    // editable이 false이거나 isFocused가 true면 'black'
    // 그 외에는 'gray' (터치가 해제된 상태)
    color: (!editable || isFocused) ? 'black' : 'gray',
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={inputStyle}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder || "여기에 입력하세요"}
        placeholderTextColor="gray"

        // 2. 입력 필드를 터치하면 isFocused를 true로 설정
        onFocus={() => setIsFocused(true)}

        // 3. 입력 필드 밖을 터치하면 isFocused를 false로 설정
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    marginBottom: 10,
  },
});