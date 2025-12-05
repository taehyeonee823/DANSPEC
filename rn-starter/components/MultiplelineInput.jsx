import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';

const MultilineInput = ({ 
    value, 
    onChangeText, 
    placeholder,
    style
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.trim().length > 0;

    return (
        <TextInput 
            style={[styles.input, style]}
            placeholder={isFocused || hasValue ? '' : placeholder} 
            placeholderTextColor="#CCCCCC"
            value={value}
            onChangeText={onChangeText}
            multiline={true} 
            numberOfLines={4}
            textAlignVertical="top"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        minHeight: 100,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 15,
        fontSize: 16,
        fontFamily: 'Pretendard-Medium',
        backgroundColor: '#fff',
        marginBottom: 20, 
    },
});

export default MultilineInput;