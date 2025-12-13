import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '@/config/api';

/**
 * 토큰 갱신 함수
 * @returns {Promise<boolean>} 갱신 성공 여부
 */
export const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (!refreshToken) {
      console.log('refreshToken이 없습니다.');
      return false;
    }

    const response = await fetch(API_ENDPOINTS.REFRESH_TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('토큰 갱신 성공:', data);

      if (data.success && data.data) {
        // 새로운 accessToken 저장
        if (data.data.accessToken) {
          await AsyncStorage.setItem('accessToken', data.data.accessToken);
        }

        // 새로운 refreshToken이 있으면 업데이트
        if (data.data.refreshToken) {
          await AsyncStorage.setItem('refreshToken', data.data.refreshToken);
        }

        return true;
      }
    } else {
      console.error('토큰 갱신 실패:', response.status);
      return false;
    }
  } catch (error) {
    console.error('토큰 갱신 오류:', error);
    return false;
  }

  return false;
};

/**
 * API 호출 헬퍼 함수 (토큰 갱신 로직 포함)
 * @param {string} url - API URL
 * @param {object} options - fetch options
 * @param {boolean} retry - 재시도 여부 (내부 사용)
 * @returns {Promise<Response>}
 */
export const fetchWithAuth = async (url, options = {}, retry = true) => {
  const token = await AsyncStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 401 오류이고 재시도 가능하면 토큰 갱신 시도
  if (response.status === 401 && retry) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      // 토큰 갱신 성공 시 다시 요청 (재시도 방지를 위해 retry=false)
      return fetchWithAuth(url, options, false);
    }
  }

  return response;
};
