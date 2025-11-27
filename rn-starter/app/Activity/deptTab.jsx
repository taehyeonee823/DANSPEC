import React, { useRef, useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';

const categories = ['전체', '문과대학', '법과대학', '사회과학대학', '경영경제대학', '사범대학',
    '프리무스국제대학', '공과대학', 'SW융합대학', '음악·예술대학', '외국어대학', '공공인재대학', '보건과학대학',
    '과학기술대학', '바이오융합대학', '예술대학', '스포츠과학대학', '의과대학', '치과대학', '약학대학', '간호대학'];

export default function DeptTab({ selectedDepartment, onSelectDepartment }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const underlineX = useRef(new Animated.Value(0)).current;

  const tabWidth = 100;

  const onPressTab = (index) => {
    setActiveIndex(index);
    Animated.spring(underlineX, {
      toValue: index * tabWidth,
      useNativeDriver: false,
    }).start();

    // 선택된 단과대를 부모 컴포넌트로 전달
    if (onSelectDepartment) {
      onSelectDepartment(categories[index]);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View>
          <View style={styles.container}>
            {categories.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => onPressTab(index)}
                style={{ width: tabWidth }}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.tabText, activeIndex === index ? styles.active : styles.inactive]}
                >
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
      </ScrollView>
      <View style={styles.iconContainer}>
        <Image
          source={require('@/assets/images/down.svg')}
          style={styles.downIcon}
          contentFit="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 100,
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  container: {
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
    marginTop: -4,
    height: 3,
    backgroundColor: '#000',
  },
  iconContainer: {
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  downIcon: {
    width: 15,
    height: 15,
  },
});
