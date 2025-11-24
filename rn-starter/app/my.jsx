import React from 'react';
import { View, StyleSheet } from 'react-native';
import NaviBar from './naviBar';

export default function My() {
  return (
    <View style={styles.container}>
      <NaviBar currentPage="my" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
