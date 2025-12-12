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

// 외부 이벤트 서버 URL
export const EVENT_SERVER_URL = 'http://43.203.191.87:8080';

// API 엔드포인트
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/login`,
  CHECK_EMAIL: `${API_BASE_URL}/api/check-email`,

  // 이메일 인증 및 회원가입 관련 API
  EMAIL_REQUEST: `${EVENT_SERVER_URL}/api/auth/email/request`,
  EMAIL_VERIFY: `${EVENT_SERVER_URL}/api/auth/email/verify`,
  SIGNUP: `${EVENT_SERVER_URL}/api/auth/signup`,

  // 이벤트 관련 API
  ALL_EVENTS: `${EVENT_SERVER_URL}/api/events`,

  SEARCH_BY_COLLEGE: (college) =>
    `${EVENT_SERVER_URL}/api/events/search?college=${encodeURIComponent(college)}`,

  SEARCH_BY_CATEGORY: (category) =>
    `${EVENT_SERVER_URL}/api/events/search?category=${encodeURIComponent(category)}`,

  SEARCH_EVENTS: (college, category) =>
    `${EVENT_SERVER_URL}/api/events/search?college=${encodeURIComponent(college)}&category=${encodeURIComponent(category)}`,

  // 팀 모집 관련 API
  CREATE_TEAM: `${EVENT_SERVER_URL}/api/teams`,
  GET_TEAMS: (myPosts) =>
    `${EVENT_SERVER_URL}/api/teams?myPosts=${myPosts}`,

  // 사용자 정보 관련 API
  USER_ME: `${EVENT_SERVER_URL}/api/users/me`,
  UPDATE_USER_INFO: `${EVENT_SERVER_URL}/api/users/me`,
};

