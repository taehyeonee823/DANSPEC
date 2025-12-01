import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, PanResponder, Animated } from 'react-native';
import { Image } from 'expo-image';

const colleges = [
  { id: 1, name: '문과대학', image: require('@/assets/images/college/humanities.svg') },
  { id: 2, name: '공공인재대학', image: require('@/assets/images/college/public.svg') },
  { id: 3, name: '법과대학', image: require('@/assets/images/college/law.svg') },
  { id: 4, name: '보건과학대학', image: require('@/assets/images/college/health.svg') },
  { id: 5, name: '사회과학대학', image: require('@/assets/images/college/socialScience.svg') },
  { id: 6, name: '과학기술대학', image: require('@/assets/images/college/science.svg') },
  { id: 7, name: '경영경제대학', image: require('@/assets/images/college/businessEconomic.svg') },
  { id: 8, name: '간호대학', image: require('@/assets/images/college/nursing.svg') },
  { id: 9, name: '사범대학', image: require('@/assets/images/college/edu.svg') },
  { id: 10, name: '바이오융합대학', image: require('@/assets/images/college/biotech.svg') },
  { id: 11, name: '프리무스국제대학', image: require('@/assets/images/college/primus.svg') },
  { id: 12, name: '예술대학', image: require('@/assets/images/college/art.svg') },
  { id: 13, name: '공과대학', image: require('@/assets/images/college/engineering.svg') },
  { id: 14, name: '스포츠과학대학', image: require('@/assets/images/college/sports.svg') },
  { id: 15, name: 'SW융합대학', image: require('@/assets/images/college/swconv.svg') },
  { id: 16, name: '의과대학', image: require('@/assets/images/college/med.svg') },
  { id: 17, name: '음악·예술대학', image: require('@/assets/images/college/musicArt.svg') },
  { id: 18, name: '치과대학', image: require('@/assets/images/college/dentistry.svg') },
  { id: 19, name: '외국어대학', image: require('@/assets/images/college/foreignLang.svg') },
  { id: 20, name: '약학대학', image: require('@/assets/images/college/pharmacy.svg') },
];

export default function ButtonSheet({ visible, onClose, onSelectCollege }) {
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.timing(translateY, {
            toValue: 500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            translateY.setValue(0);
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.sheetContainer,
            { transform: [{ translateY }] }
          ]}
        >
          <View style={styles.header} {...panResponder.panHandlers}>
            <View style={styles.dragHandle} />
          </View>

          <View style={styles.content}>
            <View style={styles.grid}>
              {colleges.map((college) => (
                <TouchableOpacity
                  key={college.id}
                  style={styles.collegeButton}
                  onPress={() => {
                    onSelectCollege(college.name);
                    onClose();
                  }}
                >
                  <Image source={college.image} style={styles.collegeImage} contentFit="contain" />
                  <Text style={styles.collegeName}>{college.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
    borderBottomColor: '#E0E0E0',
  },
  dragHandle: {
    width: 160,
    height: 6,
    backgroundColor: '#D0D0D0',
    borderRadius: 2,
  },
  content: {
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  collegeButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
  },
  collegeImage: {
    width: 20,
    height: 20,
    marginRight: 10,
    alignContent: 'center',
  },
  collegeName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
  },
});
