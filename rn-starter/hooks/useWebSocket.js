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
                // 이미 3개 이상이면 더 이상 추가하지 않음
                if (prevNotifs.length >= 3) {
                    clearInterval(mockInterval);
                    return prevNotifs;
                }
                
                const mockNotification = {
                    id: Date.now(), // 고유 ID 역할
                    title: `[MOCK] 새 알림이 도착했어요! (${prevNotifs.length + 1}번째)`,
                    message: '백엔드가 준비될 때까지 클라이언트 UI를 테스트하세요.',
                    timestamp: Date.now(),
                    read: false, // 기본적으로 읽지 않은 상태
                };
                
                const newNotifs = [mockNotification, ...prevNotifs];
                
                // 3개가 되면 interval 멈춤
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