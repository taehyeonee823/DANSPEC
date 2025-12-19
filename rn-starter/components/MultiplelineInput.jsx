import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';

const MultilineInput = ({ 
    value, 
    onChangeText, 
    placeholder,
    style,
    onFocus,
    onBlur,
    placeholderTextColor = "#CCCCCC",
}) => {
    const [isFocused, setIsFocused] = useState(false);

    // 포커스 상태에 따라 색상을 결정합니다.
    // 포커스가 되면 기존 텍스트도 모두 검정색으로 표시
    const inputStyle = {
        ...styles.input,
        // isFocused가 true면 'black' (터치된 상태)
        // isFocused가 false이고 value가 있으면 'black' (입력된 텍스트는 항상 검정)
        // isFocused가 false이고 value가 없으면 'gray' (빈 상태일 때만 회색)
        color: (isFocused || value) ? 'black' : 'gray',
    };

    return (
        <TextInput 
            style={[inputStyle, style]}
            placeholder={placeholder} 
            placeholderTextColor={placeholderTextColor}
            value={value}
            onChangeText={onChangeText}
            onFocus={(e) => {
                setIsFocused(true);
                if (onFocus) onFocus(e);
            }}
            onBlur={(e) => {
                setIsFocused(false);
                if (onBlur) onBlur(e);
            }}
            multiline={true} 
            numberOfLines={4}
            textAlignVertical="top"
        />
    );
};

const styles = StyleSheet.create({
    input: {
        minHeight: 100,
        borderWidth: 1,
        borderColor: '#3E6AF433',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 15,
        fontSize: 16,
        backgroundColor: '#fff',
        marginBottom: 20, 
    },
});

export default MultilineInput;