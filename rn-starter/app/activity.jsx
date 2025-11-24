import React from 'react';
import { View, StyleSheet } from 'react-native';
import NaviBar from './naviBar';

export default function Activity() {
  return (
    <View style={styles.container}>
      <NaviBar currentPage="activity" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
