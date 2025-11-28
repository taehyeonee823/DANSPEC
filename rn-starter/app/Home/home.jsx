import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
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
          style={styles.scrollView}
        >
          <Image
            source={require('@/assets/images/frame1.png')}
            style={styles.frameImage}
            resizeMode="cover"
          />
          <Image
            source={require('@/assets/images/frame2.png')}
            style={styles.frameImage}
            resizeMode="cover"
          />
        </ScrollView>
      </View>

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
    height: 300,
    overflow: 'hidden',
  },
  scrollView: {
    height: 300,
  },
  frameImage: {
    width: width,
    height: 300,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#000',
    width: 10,
    height: 10,
    borderRadius: 5,
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
