import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const Button = ({ onPress, title, style, textStyle }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#3E6AF4',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'Pretendard-Medium',
    },
});

export default Button;  
