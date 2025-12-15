import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

export default function DynamicInputByFocus({ value, onChangeText, placeholder, ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  // 1. 포커스 상태에 따라 색상을 결정합니다.
  const inputStyle = {
    ...styles.input,
    // isFocused가 true면 'black' (터치된 상태)
    // isFocused가 false면 'gray' (터치가 해제된 상태)
    color: isFocused ? 'black' : 'gray',
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
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
});