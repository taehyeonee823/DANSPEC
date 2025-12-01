import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import NaviBar from '../naviBar';
import { ThemedText } from '@/components/themed-text';
import Applier from './applierCard';
import applierData from './applier.json';

export default function My() {
  const router = useRouter();
  const [appliers, setAppliers] = useState(applierData);

  const handleAccept = (id) => {
    setAppliers(prevAppliers =>
      prevAppliers.map(applier =>
        applier.id === id ? { ...applier, status: 'accepted' } : applier
      )
    );
  };

  const handleReject = (id) => {
    setAppliers(prevAppliers =>
      prevAppliers.filter(applier => applier.id !== id)
    );
  };

  const pendingAppliers = appliers.filter(applier => applier.status === 'pending');
  const acceptedAppliers = appliers.filter(applier => applier.status === 'accepted');

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 90,
          backgroundColor: '#ffffff',
          zIndex: 998,
        }}
      />

      {/* 화살표와 글씨를 한 행에 배치, 글씨 중앙 정렬 */}
      <View
        style={{
          marginTop: 70,
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          position: 'relative',
        }}
      >
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 20,
            padding: 8,
          }}
          onPress={() => router.back()}
        >
          <Text style={{ fontSize: 28, color: '#000', fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
            color: '#000',
          }}
        >
          멤버 관리하기
        </Text>
      </View>
      <ScrollView style={styles.container}>
        <View style={[ { flexDirection: 'row', alignItems: 'center' }]}>
          <Image
            source={require('../../assets/images/bell.png')}
            style={{ width: 20, height: 20, marginRight: 5 }}
          />
          <Text style={styles.subtitle}>받은 요청</Text>
        </View>

        {pendingAppliers.map((applier) => (
          <Applier
            key={applier.id}
            id={applier.id}
            name={applier.name}
            grade={applier.grade}
            campus={applier.campus}
            college={applier.college}
            major={applier.major}
            introduction={applier.introduction}
            description={applier.description}
            time={applier.time}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ))}

        <View style={[styles.footer, { flexDirection: 'row', alignItems: 'center' }]}>
          <Image
            source={require('../../assets/images/users.svg')}
            style={{ width: 20, height: 20, marginRight: 5 }}
          />
          <Text style={styles.subtitle}>현재 멤버</Text>
        </View>

        {acceptedAppliers.map((applier) => (
          <Applier
            key={applier.id}
            id={applier.id}
            name={applier.name}
            grade={applier.grade}
            campus={applier.campus}
            college={applier.college}
            major={applier.major}
            introduction={applier.introduction}
            description={applier.description}
            time={applier.time}
            hideButtons={true}
          />
        ))}
      </ScrollView>
      <NaviBar currentPage="my" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: '#FFFFFF',
    paddingBottom: 150,
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
