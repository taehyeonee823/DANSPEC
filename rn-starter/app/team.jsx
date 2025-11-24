import React from 'react';
import { View, StyleSheet } from 'react-native';
import NaviBar from './naviBar';

export default function Team() {
  return (
    <View style={styles.container}>
      <NaviBar currentPage="team" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
