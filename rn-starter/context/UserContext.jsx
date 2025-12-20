import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_ENDPOINTS } from '@/config/api';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    college: '',
    major: '',
    grade: '',
    interestJobPrimary: '',
  });

  // SecureStore에서 사용자 정보 로드
  useEffect(() => {
    loadUserInfoFromStorage();
  }, []);

  const loadUserInfoFromStorage = async () => {
    try {
      const storedName = await SecureStore.getItemAsync('userName');
      const storedCollege = await SecureStore.getItemAsync('userCollege');
      const storedMajor = await SecureStore.getItemAsync('userMajor');
      const storedGrade = await SecureStore.getItemAsync('userGrade');
      const storedInterestJob = await SecureStore.getItemAsync('userInterestJobPrimary');

      if (storedName) {
        setUserInfo({
          name: storedName || '',
          college: storedCollege || '',
          major: storedMajor || '',
          grade: storedGrade || '',
          interestJobPrimary: storedInterestJob || '',
        });
      }
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
    }
  };

  const updateUserInfo = useCallback(async (info) => {
    try {
      // 상태 업데이트
      setUserInfo({
        name: info.name || '',
        college: info.college || '',
        major: info.major || '',
        grade: info.grade || '',
        interestJobPrimary: info.interestJobPrimary || '',
      });

      // SecureStore에 저장
      if (info.name) await SecureStore.setItemAsync('userName', info.name);
      if (info.college) await SecureStore.setItemAsync('userCollege', info.college);
      if (info.major) await SecureStore.setItemAsync('userMajor', info.major);
      if (info.grade) await SecureStore.setItemAsync('userGrade', info.grade);
      if (info.interestJobPrimary) await SecureStore.setItemAsync('userInterestJobPrimary', info.interestJobPrimary);
    } catch (error) {
      console.error('사용자 정보 저장 실패:', error);
    }
  }, []);

  const clearUserInfo = useCallback(async () => {
    try {
      setUserInfo({
        name: '',
        college: '',
        major: '',
        grade: '',
        interestJobPrimary: '',
      });

      await SecureStore.deleteItemAsync('userName');
      await SecureStore.deleteItemAsync('userCollege');
      await SecureStore.deleteItemAsync('userMajor');
      await SecureStore.deleteItemAsync('userGrade');
      await SecureStore.deleteItemAsync('userInterestJobPrimary');
    } catch (error) {
      console.error('사용자 정보 삭제 실패:', error);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo, clearUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

