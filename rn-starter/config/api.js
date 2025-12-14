import Constants from 'expo-constants';

// 외부 이벤트 서버 URL
export const EVENT_SERVER_URL = 'http://43.203.191.87:8080';

// API 엔드포인트
export const API_ENDPOINTS = {
  LOGIN: `${EVENT_SERVER_URL}/api/auth/login`,
  REFRESH_TOKEN: `${EVENT_SERVER_URL}/api/auth/token/refresh`,

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

  // 맞춤 추천 이벤트 API
  RECOMMENDED_EVENTS: `${EVENT_SERVER_URL}/api/events/recommended`,

  // 팀 모집 관련 API
  CREATE_TEAM: `${EVENT_SERVER_URL}/api/teams`,
  GET_TEAMS: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return `${EVENT_SERVER_URL}/api/teams${query ? `?${query}` : ''}`;
  },
  GET_APPLICATIONS: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return `${EVENT_SERVER_URL}/api/applications${query ? `?${query}` : ''}`;
  },

  // 팀 지원자 관련 API
  GET_TEAM_APPLICATIONS: (teamId) => `${EVENT_SERVER_URL}/api/teams/${teamId}/applications`,
  GET_TEAM_DETAIL: (teamId) => `${EVENT_SERVER_URL}/api/teams/${teamId}`,
  UPDATE_TEAM: (teamId) => `${EVENT_SERVER_URL}/api/teams/${teamId}`,
  DELETE_TEAM: (teamId) => `${EVENT_SERVER_URL}/api/teams/${teamId}`,

  // 사용자 정보 관련 API
  USER_ME: `${EVENT_SERVER_URL}/api/users/me`,
  UPDATE_USER_INFO: `${EVENT_SERVER_URL}/api/users/me`,
};

