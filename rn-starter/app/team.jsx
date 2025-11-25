import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import NaviBar from './naviBar';
import { ThemedText } from '@/components/themed-text';

export default function Team() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <NaviBar currentPage="team" />
       <ThemedText style={styles.title}>이곳은 팀 화면 입니다.</ThemedText>

       <TouchableOpacity
         style={styles.floatingButton}
         onPress={() => router.push('/TeamApplicationForm')}
       >
         <Image
           source={require('@/assets/images/plusBotton.png')}
           style={styles.plusIcon}
         />
       </TouchableOpacity>
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
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 110,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  plusIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});
