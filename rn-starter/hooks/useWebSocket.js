import { useState, useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWithAuth, refreshAccessToken } from '@/utils/auth';

/**
 * SSE를 통한 실시간 알림 수신 훅 + 초기 알림 목록 fetch
 * API 응답 필드를 컴포넌트에서 사용하는 필드로 매핑:
 * - content → message
 * - read → read (응답 필드 그대로)
 * - createdAt → timestamp
 *
 * @returns {Object} { notifications, deleteNotification, loading }
 */
export const useWebSocket = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const eventSourceRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    // API 응답을 컴포넌트용 필드로 매핑하는 헬퍼
    const mapNotification = (n) => ({
        id: n.id,
        title: n.title,
        message: n.content,        // content → message
        timestamp: n.createdAt,    // createdAt → timestamp
        read: n.read ?? n.isRead,  // read 또는 isRead
        type: n.type,
    });

    useEffect(() => {
        let isMounted = true;

        const clearAuthAndStop = async () => {
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            await AsyncStorage.removeItem('autoLogin');
        };

        // 1) 기존 알림 목록을 GET /api/notifications 로 가져오기
        const fetchInitialNotifications = async () => {
            try {
                const response = await fetchWithAuth(API_ENDPOINTS.NOTIFICATIONS, {
                    method: 'GET',
                });

                if (response.ok) {
                    const json = await response.json();
                    const list = json.success && Array.isArray(json.data) ? json.data : [];
                    if (isMounted) {
                        setNotifications(list.map(mapNotification));
                    }
                } else if (response.status === 401) {
                    // refresh도 실패한 경우
                    await clearAuthAndStop();
                } else {
                    console.warn('Failed to fetch notifications:', response.status);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        // 2) SSE로 실시간 알림 구독
        const connectSSE = async () => {
            // SSE는 장시간 열린 연결이므로 별도 타임아웃으로 abort하면 AbortError가 계속 발생할 수 있음
            // 필요 시 네트워크가 아주 나쁜 환경에서만 끊고 싶다면 TIMEOUT_MS 값을 크게 잡으세요.
            const TIMEOUT_MS = 0; // 0이면 타임아웃 비활성화

            try {
                // SSE는 fetchWithAuth를 쓰면 재호출 시 스트림이 꼬일 수 있어,
                // 연결 전 토큰을 한 번만 갱신 시도하고, 해당 토큰으로 바로 연결
                const accessToken = await AsyncStorage.getItem('accessToken');
                if (!accessToken) {
                    // refresh 시도
                    const refreshed = await refreshAccessToken();
                    if (!refreshed) {
                        await clearAuthAndStop();
                        return;
                    }
                }

                const tokenAfter = await AsyncStorage.getItem('accessToken');
                if (!tokenAfter) return;

                const url = API_ENDPOINTS.NOTIFICATIONS_SUBSCRIBE;

                const controller = new AbortController();
                const timeoutId = TIMEOUT_MS > 0 ? setTimeout(() => controller.abort(), TIMEOUT_MS) : null;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${tokenAfter}`,
                        'Accept': 'text/event-stream',
                    },
                    signal: controller.signal,
                }).finally(() => {
                    if (timeoutId) clearTimeout(timeoutId);
                });

                if (response.status === 401) {
                    await clearAuthAndStop();
                    return;
                }

                if (!response.ok) {
                    throw new Error(`SSE connection failed: ${response.status}`);
                }

                if (!response.body || typeof response.body.getReader !== 'function') {
                    console.warn('SSE stream is not supported in this environment (no response.body).');
                    return;
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                const processStream = async () => {
                    try {
                        while (isMounted) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            buffer += decoder.decode(value, { stream: true });
                            const lines = buffer.split('\n');
                            buffer = lines.pop() || '';

                            for (const line of lines) {
                                if (line.startsWith('data:')) {
                                    const data = line.substring(5).trim();
                                    if (!data) continue;
                                    try {
                                        const notification = JSON.parse(data);
                                        const mapped = mapNotification(notification);
                                        if (isMounted) setNotifications(prev => [mapped, ...prev]);
                                    } catch (e) {
                                        console.error('Failed to parse notification:', e);
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        // AbortError는 타임아웃/종료에 의해 발생할 수 있으므로 조용히 처리
                        if (error?.name === 'AbortError') {
                            return;
                        }
                        console.error('Error reading SSE stream:', error);
                        if (isMounted) {
                            reconnectTimeoutRef.current = setTimeout(() => {
                                connectSSE();
                            }, 5000);
                        }
                    }
                };

                processStream();
            } catch (error) {
                // AbortError는 타임아웃/종료에 의해 발생할 수 있으므로 조용히 처리
                if (error?.name === 'AbortError') {
                    return;
                }
                console.error('SSE connection error:', error);
                if (isMounted) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connectSSE();
                    }, 5000);
                }
            }
        };

        fetchInitialNotifications();
        connectSSE();

        return () => {
            isMounted = false;
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            // reader가 열린 상태면 종료시키는 것이 좋지만, 여기서는 fetch 스코프 밖이라 abort로 회수하는 패턴을 권장
        };
    }, []);

    // 알림 삭제 함수
    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return { notifications, deleteNotification, loading };
};