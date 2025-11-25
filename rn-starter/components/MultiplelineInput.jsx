import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const MultilineInput = ({ 
    value, 
    onChangeText, 
    placeholder,
    style
}) => {
    return (
        <TextInput 
            style={[styles.input, style]}
            placeholder={placeholder} 
            placeholderTextColor="#999"
            value={value}
            onChangeText={onChangeText}
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
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 15,
        fontSize: 12,
        backgroundColor: '#fff',
        marginBottom: 20, 
    },
});

export default MultilineInput;