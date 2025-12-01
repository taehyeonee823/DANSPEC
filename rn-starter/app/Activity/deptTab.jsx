import React, { useRef, useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import ButtonSheet from './buttonSheet';

const categories = ['전체', '문과대학', '법과대학', '사회과학대학', '경영경제대학', '사범대학',
    '프리무스국제대학', '공과대학', 'SW융합대학', '음악·예술대학', '외국어대학', '공공인재대학', '보건과학대학',
    '과학기술대학', '바이오융합대학', '예술대학', '스포츠과학대학', '의과대학', '치과대학', '약학대학', '간호대학'];

export default function DeptTab({ selectedDepartment, onSelectDepartment }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sheetVisible, setSheetVisible] = useState(false);
  const underlineX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const tabWidth = 100;

  const onPressTab = (index) => {
    setActiveIndex(index);
    Animated.spring(underlineX, {
      toValue: index * tabWidth,
      useNativeDriver: false,
    }).start();

    // ScrollView를 해당 탭 위치로 스크롤
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * tabWidth - 100,
        animated: true,
      });
    }

    if (onSelectDepartment) {
      onSelectDepartment(categories[index]);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollViewRef}
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
        <TouchableOpacity onPress={() => {
          setSheetVisible(true);
        }}>
          <Image
            source={require('@/assets/images/down.svg')}
            style={styles.downIcon}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      <ButtonSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onSelectCollege={(collegeName) => {
          if (onSelectDepartment) {
            onSelectDepartment(collegeName);
          }
          const index = categories.findIndex(cat => cat === collegeName);
          if (index !== -1) {
            onPressTab(index);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 68,
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
    paddingVertical: 10,
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
    width: 20,
    height: 20,
  },
});
