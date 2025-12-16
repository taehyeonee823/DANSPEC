import React, { useRef, useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Dimensions } from 'react-native';

const categories = ['팀 모집글', '팀 지원글'];

export default function CategoryTab({ activeIndex, onChangeIndex }) {
  const underlineX = useRef(new Animated.Value(0)).current;

  const screenWidth = Dimensions.get('window').width;
  const tabWidth = screenWidth / categories.length;

  const onPressTab = (index) => {
    onChangeIndex(index);
    Animated.spring(underlineX, {
      toValue: index * tabWidth,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View>
      <View style={styles.container}>
        {categories.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => onPressTab(index)}
            style={{ width: tabWidth }}
          >
            <Text style={[styles.tabText, activeIndex === index ? styles.active : styles.inactive]}>
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <Animated.View
        style={[
          styles.underline,
          { width: tabWidth, transform: [{ translateX: underlineX }] },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d1',
  },
  tabText: {
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
  active: {
    color: '#000',
  },
  inactive: {
    color: '#cfcfcf',
  },
  underline: {
    marginTop: -4,
    height: 3,
    backgroundColor: '#000',
  },
});
