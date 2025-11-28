import React, { useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Text } from 'react-native';
import NaviBar from '../naviBar';
import { ThemedText } from '@/components/themed-text';

const { width } = Dimensions.get('window');

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* 첫 번째 슬라이드 */}
          <View style={{ width }}>
            <LinearGradient
              colors={['#4D90CC', '#fff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1, paddingTop: 180 }}
            >
              <View style={styles.slideContent}>
                <View style={styles.leftBox}>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>활동 둘러보기</Text>
                  </TouchableOpacity>

                  <Text style={styles.slideTitle}>지금 시작해 볼만한 활동</Text>

                  <Text style={styles.sub}>
                    공모전부터 교내 · 대외 활동까지!{'\n'}드림이가 나만을 위해 골라봤어요
                  </Text>
                </View>

                <Image
                  source={require('@/assets/images/dreame.png')}
                  style={styles.logo1}
                  resizeMode="contain"
                />
              </View>
            </LinearGradient>
          </View>

          {/* 두 번째 슬라이드 */}
          <View style={{ width }}>
            <LinearGradient
              colors={['#957DAD', '#fff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1, paddingTop: 180 }}
            >
              <View style={styles.slideContent}>
                <View style={styles.leftBox}>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>활동 둘러보기</Text>
                  </TouchableOpacity>

                  <Text style={styles.slideTitle}>단과대별 활동 한눈에 보기</Text>

                  <Text style={styles.sub}>
                    문과부터 SW융합, 음예대까지!{'\n'}
                    단과대별로 맞는 활동을 골라보세요
                  </Text>
                </View>

                <Image
                  source={require('@/assets/images/danspecLogo.png')}
                  style={styles.logo2}
                  resizeMode="contain"
                />
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
      <ThemedText style={styles.title}>name 님에게 딱 맞는 활동</ThemedText>

      <NaviBar currentPage="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    height: 350,
    backgroundColor: '#F0F0F0',
  },
  slideContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leftBox: {
    flex: 1,
    gap: 16,
  },
  button: {
    marginLeft:20,
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  slideTitle: {
    marginLeft:20,
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },
  sub: {
    marginLeft:20,
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  logo1: {
    width: 150,
    height: 150,
    marginLeft: 30,
    marginRight: 20,
    opacity: 0.8
  },
  logo2: {
    width: 100,
    height: 100,
    marginLeft: 30,
    marginRight: 20,
    opacity: 0.4
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 10,
    marginLeft: 20,
    paddingTop: 10,
    color: '#000',
    textAlign: 'left',
  },
});
