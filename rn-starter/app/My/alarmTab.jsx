import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

const categories = ['알림', '가입 요청'];

export default function CategoryTab() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);
  const underlineX = useRef(new Animated.Value(0)).current;

  const screenWidth = Dimensions.get('window').width;
  const tabWidth = screenWidth / categories.length;

  // 현재 경로에 따라 활성 탭 설정
  useEffect(() => {
    if (pathname === '/My/notificationScreen') {
      setActiveIndex(0);
      Animated.spring(underlineX, {
        toValue: 0 * tabWidth,
        useNativeDriver: false,
      }).start();
    } else if (pathname === '/My/recruitmentNow') {
      setActiveIndex(1);
      Animated.spring(underlineX, {
        toValue: 1 * tabWidth,
        useNativeDriver: false,
      }).start();
    }
  }, [pathname, tabWidth]);

  const onPressTab = (index) => {
    setActiveIndex(index);
    Animated.spring(underlineX, {
      toValue: index * tabWidth,
      useNativeDriver: false,
    }).start();

    // 알림 탭(index 0)을 누르면 notificationScreen으로 이동
    if (index === 0) {
      if (pathname !== '/My/notificationScreen') {
        router.push('./notificationScreen');
      }
    } else if (index === 1) {
      // 가입 요청 탭을 누르면 recruitmentNow로 이동
      if (pathname !== '/My/recruitmentNow') {
        router.push('./recruitmentNow');
      }
    }
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
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d1',
  },
  tabText: {
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Pretendard-Regular'
  },
  active: {
    color: '#000',
    fontFamily: 'Pretendard-SemiBold',
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
