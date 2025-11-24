import React from 'react';
import { View, StyleSheet } from 'react-native';
import NaviBar from './naviBar';
import { ThemedText } from '@/components/themed-text';

export default function Activity() {
  return (
    <View style={styles.container}>
      <NaviBar currentPage="activity" />
       <ThemedText style={styles.title}>이곳은 활동 화면 입니다.</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 120,
    marginLeft: 20,
    paddingTop: 10,
    color: '#000',
    textAlign: 'left',
  },
});
