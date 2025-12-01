import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
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
  { id: 17, name: '음악예술대학', image: require('@/assets/images/college/musicArt.svg') },
  { id: 18, name: '치과대학', image: require('@/assets/images/college/dentistry.svg') },
  { id: 19, name: '외국어대학', image: require('@/assets/images/college/foreignLang.svg') },
  { id: 20, name: '약학대학', image: require('@/assets/images/college/pharmacy.svg') },
];

export default function ButtonSheet({ visible, onClose, onSelectCollege }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
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
          </ScrollView>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    fontSize: 24,
    color: '#666',
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
