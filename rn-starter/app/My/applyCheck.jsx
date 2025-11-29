import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import NaviBar from '../naviBar';
import { ThemedText } from '@/components/themed-text';
import Applier from './applierCard';
import applierData from './applier.json';

export default function My() {
  const router = useRouter();
  const appliers = applierData;

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150,
        backgroundColor: '#ffffff',
        zIndex: 998
      }} />

      <TouchableOpacity
        style={{ position: 'absolute', top: 60, left: 20, zIndex: 999, padding: 8 }}
        onPress={() => router.back()}
      >
        <Text style={{ fontSize: 28, color: '#000', fontWeight: 'bold' }}>←</Text>
      </TouchableOpacity>

      <View style={{ position: 'absolute', top: 95, left: 30, zIndex: 999 }}>
        <Text style={styles.title}>멤버 확인하기</Text>
      </View>

      <ScrollView style={styles.container}
        contentContainerStyle={styles.scrollViewContent}>

      <View style={[styles.footer, { flexDirection: 'row', alignItems: 'center' }]}>
        <Image
          source={require('../../assets/images/bell.png')}
          style={{ width: 20, height: 20 ,marginRight: 5}}
        />
        <Text style={styles.subtitle}>받은 요청</Text>
      </View>

        {appliers.map((applier) => (
          <Applier
            key={applier.id}
            name={applier.name}
            grade={applier.grade}
            campus={applier.campus}
            college={applier.college}
            major={applier.major}
            introduction={applier.introduction}
            description={applier.description}
            time={applier.time}
          />
        ))}

      <View style={[styles.footer, { flexDirection: 'row', alignItems: 'center' }]}>
        <Image
          source={require('../../assets/images/users.svg')}
          style={{ width: 20, height: 20 ,marginRight: 5}}
        />
        <Text style={styles.subtitle}>현재 멤버</Text>
      </View>
        
      </ScrollView>
      <NaviBar currentPage="my" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 140,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    paddingTop: 10,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    textAlign: 'left',
    paddingTop: 20,
    marginBottom: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});
