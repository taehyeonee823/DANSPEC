import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';

export default function Applier({name, grade, campus, college, major, introduction, description, time}) {

  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const getTimeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 1000 / 60);

    if (minutes < 1) return "방금 전";
    
    if (minutes < 60) return `${minutes}분 전`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;

    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  };

  const createdAt = time
  const formattedTime = getTimeAgo(createdAt);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setIsExpanded(!isExpanded)}
    >

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.label}>{formattedTime}</Text>
      </View>

      <Text style={styles.college}>{grade} | {campus}캠퍼스 {college} {major}</Text>

      {isExpanded && (
        <>
          <View style={styles.row}>
            <Text style={styles.label}>소개:</Text>
            <Text style={styles.introduction}>{introduction}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>지원동기:</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { borderColor: '#4CAF50' }]}
              onPress={(e) => {
                e.stopPropagation();
                setShowAcceptModal(true);
              }}
            >
              <Text style={[styles.buttonText, { color: '#4CAF50' }]}>✅ 승인</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { borderColor: '#F44336' }]}
              onPress={(e) => {
                e.stopPropagation();
                setShowRejectModal(true);
              }}
            >
              <Text style={[styles.buttonText, { color: '#F44336' }]}>❌ 거절</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Text style={styles.toggleText}>{isExpanded ? '▲ 지원서 접기' : '▼ 지원서 펼치기'}</Text>

      {/* 승인 확인 모달 */}
      <Modal
        transparent={true}
        visible={showAcceptModal}
        animationType="fade"
        onRequestClose={() => setShowAcceptModal(false)}
      >
        <BlurView intensity={30} style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            
            <Image
             source={require('@/assets/images/oCircle.png')}
              style={styles.logo1}
              contentFit="contain"
            />

            <Text style={styles.modalMessage}>{name}님 요청을 승인하시겠어요?</Text>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowAcceptModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={() => {
                  console.log('승인:', name);
                  setShowAcceptModal(false);
                  // 승인 후 카드 승인자 탭으로 이동, 인원 수 1 증가
                }}
              >
                <Text style={styles.modalConfirmButtonText}>승인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      <Modal
        transparent={true}
        visible={showRejectModal}
        animationType="fade"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <BlurView intensity={30} style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            <Image
             source={require('@/assets/images/xCircle.png')}
              style={styles.logo1}
              contentFit="contain"
            />

            <Text style={styles.modalMessage}>{name}님 요청을 거절하시겠어요?</Text>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowRejectModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalRejectButton]}
                onPress={() => {
                  console.log('거절:', name);
                  setShowRejectModal(false);
                  // 거절 후 카드 삭제
                }}
              >
                <Text style={styles.modalRejectButtonText}>거절</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EDF0F1',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  college: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: '#000',
    marginRight: 4,
  },
  introduction: {
    flex: 1,
    fontSize: 13,
    fontWeight: '300',
    color: '#222',
  },
  description: {
    flex: 1,
    fontSize: 13,
    fontWeight: '300',
    color: '#222',
    lineHeight: 18,
  },
  toggleText: {
    fontSize: 12,
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalMessage: {
    fontSize: 14,
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#E0E0E0',
  },
  modalConfirmButton: {
    backgroundColor: '#4CAF50',
  },
  modalRejectButton: {
    backgroundColor: '#F44336',
  },
  modalCancelButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  modalConfirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  logo1: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginBottom: 16,
  },
});