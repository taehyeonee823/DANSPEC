import Constants from 'expo-constants';

// Expo의 개발 서버 호스트를 자동으로 감지
const getApiUrl = () => {
  // Expo 개발 서버의 호스트 주소 가져오기 (예: "192.168.1.5:8081")
  const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];

  // 개발 환경에서는 Expo가 감지한 호스트 사용, 없으면 localhost 사용
  const host = expoHost || 'localhost';

  // FastAPI 서버 포트
  const port = 6000;

  return `http://${host}:${port}`;
};

export const API_BASE_URL = getApiUrl();

// API 엔드포인트
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/login`,
  SIGNUP: `${API_BASE_URL}/api/signup`,
  CHECK_EMAIL: `${API_BASE_URL}/api/check-email`,
};
