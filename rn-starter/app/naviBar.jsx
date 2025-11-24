import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function NaviBar({ currentPage }) {
  const router = useRouter();

  return (
    <View style={styles.navigationBar}>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
        <Image
          source={currentPage === 'home' ? require('@/assets/images/blueHome.png') : require('@/assets/images/home.png')}
          style={styles.navIcon}
          resizeMode="contain"
        />
        <Text style={currentPage === 'home' ? styles.nowNavText : styles.navText}>홈</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/activity')}>
        <Image
          source={currentPage === 'activity' ? require('@/assets/images/blueActivity.png') : require('@/assets/images/activity.png')}
          style={styles.navIcon}
          resizeMode="contain"
        />
        <Text style={currentPage === 'activity' ? styles.nowNavText : styles.navText}>활동</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/team')}>
        <Image
          source={currentPage === 'team' ? require('@/assets/images/blueTeam.png') : require('@/assets/images/team.png')}
          style={styles.navIcon}
          resizeMode="contain"
        />
        <Text style={currentPage === 'team' ? styles.nowNavText : styles.navText}>팀</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/my')}>
        <Image
          source={currentPage === 'my' ? require('@/assets/images/blueMy.png') : require('@/assets/images/my.png')}
          style={styles.navIcon}
          resizeMode="contain"
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
    color: '#3E6AF4',
  },
});
