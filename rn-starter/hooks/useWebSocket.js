// useWebSocket.js 파일 (Mocking Version)

import { useState, useEffect } from 'react';

// 웹소켓 연결 없이 테스트를 위한 더미 데이터 생성 훅

export const useWebSocket = (userId) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // 알림이 3개 미만일 때만 새로운 알림 생성
        if (notifications.length >= 3) {
            return;
        }

        // 백엔드 없이 3초마다 새로운 가짜 알림을 생성하여 상태에 주입
        const mockInterval = setInterval(() => {
            setNotifications(prevNotifs => {
                if (prevNotifs.length >= 3) {
                    clearInterval(mockInterval);
                    return prevNotifs;
                }

                let mockNotification;
                if (prevNotifs.length === 0) {
                    mockNotification = {
                        id: Date.now(),
                        title: `[MOCK] 가입 되었습니다! (1번째)`,
                        message: '축하합니다. 가입이 승인되었습니다.',
                        timestamp: Date.now(),
                        read: false,
                    };
                } else if (prevNotifs.length === 1) {
                    mockNotification = {
                        id: Date.now() + 1,
                        title: `[MOCK] 가입 되었습니다! (2번째)`,
                        message: '축하합니다. 가입이 승인되었습니다.',
                        timestamp: Date.now(),
                        read: false,
                    };
                } else {
                    mockNotification = {
                        id: Date.now() + 2,
                        title: `[MOCK] 가입이 거절되었습니다.`,
                        message: '죄송합니다. 가입이 거절되었습니다.',
                        timestamp: Date.now(),
                        read: false,
                    };
                }

                const newNotifs = [mockNotification, ...prevNotifs];
                if (newNotifs.length >= 3) {
                    clearInterval(mockInterval);
                }
                return newNotifs;
            });
        }, 3000); 

        // 클린업 함수: 컴포넌트 언마운트 시 인터벌 해제
        return () => {
            clearInterval(mockInterval);
        };
    }, [notifications.length]); // 알림 개수가 변경될 때만 의존성 변경

    // 알림 삭제 함수
    const deleteNotification = (id) => {
        setNotifications(prevNotifs => prevNotifs.filter(notif => notif.id !== id));
    };

    return { notifications, deleteNotification };
};