import React from 'react';
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
    return (
        <TextInput 
            style={styles.input}
            placeholder={placeholder} 
            placeholderTextColor={placeholderTextColor}
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
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