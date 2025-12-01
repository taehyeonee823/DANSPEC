import React, { useRef, useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';

const categories = ['전체', '공모전', '대외활동', '교내활동'];

export default function CategoryTab() {
  const [activeIndex, setActiveIndex] = useState(0);
  const underlineX = useRef(new Animated.Value(0)).current;

  const tabWidth = 108;

  const onPressTab = (index) => {
    setActiveIndex(index);
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
    paddingTop: 100,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d1',
  },
  tabText: {
    textAlign: 'center',
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '700',
  },
  active: {
    color: '#000',
  },
  inactive: {
    color: '#cfcfcf',
  },
  underline: {
    height: 2,
    backgroundColor: '#000',
  },
});
