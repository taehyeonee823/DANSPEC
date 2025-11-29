import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';

const colleges = [
  { id: 1, name: '문과대학', image: require('@/assets/images/college/humanities.png') },
  { id: 2, name: '법과대학', image: require('@/assets/images/college/law.png') },
  { id: 3, name: '사회과학대학', image: require('@/assets/images/college/socialScience.png') },
  { id: 4, name: '경영경제대학', image: require('@/assets/images/college/businessEconomic.png') },
  { id: 5, name: '사범대학', image: require('@/assets/images/college/edu.png') },
  { id: 6, name: '프리무스국제대학', image: require('@/assets/images/college/primus.png') },
  { id: 7, name: '공과대학', image: require('@/assets/images/college/engineering.png') },
  { id: 8, name: 'SW융합대학', image: require('@/assets/images/college/swconv.png') },
  { id: 9, name: '음악예술대학', image: require('@/assets/images/college/musicArt.png') },
  { id: 10, name: '외국어대학', image: require('@/assets/images/college/foreignLang.png') },
  { id: 11, name: '공공인재대학', image: require('@/assets/images/college/public.png') },
  { id: 12, name: '보건과학대학', image: require('@/assets/images/college/health.png') },
  { id: 13, name: '과학기술대학', image: require('@/assets/images/college/science.png') },
  { id: 14, name: '바이오융합대학', image: require('@/assets/images/college/biotech.png') },
  { id: 15, name: '예술대학', image: require('@/assets/images/college/art.png') },
  { id: 16, name: '스포츠과학대학', image: require('@/assets/images/college/sports.png') },
  { id: 17, name: '의과대학', image: require('@/assets/images/college/med.png') },
  { id: 18, name: '치과대학', image: require('@/assets/images/college/dentistry.png') },
  { id: 19, name: '약학대학', image: require('@/assets/images/college/pharmacy.png') },
  { id: 20, name: '간호대학', image: require('@/assets/images/college/nursing.png') },
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
                  <Image source={college.image} style={styles.collegeImage} resizeMode="contain" />
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
    backgroundColor: '#F5F5F5',
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
