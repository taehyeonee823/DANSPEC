import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function NaviBar({ currentPage }) {
  const router = useRouter();

  return (
    <View style={styles.navigationBar}>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
        <Image
          source={require('../assets/images/home.svg')}
          style={styles.navIcon}
          contentFit="contain"
          tintColor={currentPage === 'home' ? '#3E6AF4' : '#333333'}
        />
        <Text style={currentPage === 'home' ? styles.nowNavText : styles.navText}>홈</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/activity')}>
        <Image
          source={require('../assets/images/compass.svg')}
          style={styles.navIcon}
          contentFit="contain"
          tintColor={currentPage === 'activity' ? '#3E6AF4' : '#333333'}
        />
        <Text style={currentPage === 'activity' ? styles.nowNavText : styles.navText}>활동</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/team')}>
        <Image
          source={require('../assets/images/users.svg')}
          style={styles.navIcon}
          contentFit="contain"
          tintColor={currentPage === 'team' ? '#3E6AF4' : '#333333'}
        />
        <Text style={currentPage === 'team' ? styles.nowNavText : styles.navText}>팀</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/my')}>
        <Image
          source={require('../assets/images/user.svg')}
          style={styles.navIcon}
          contentFit="contain"
          tintColor={currentPage === 'my' ? '#3E6AF4' : '#333333'}
        />
        <Text style={currentPage === 'my' ? styles.nowNavText : styles.navText}>마이</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navigationBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 30,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#333333',
  },
  nowNavText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3E6AF4',
  },
});
