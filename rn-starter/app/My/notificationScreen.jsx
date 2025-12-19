import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { useWebSocket } from '@/hooks/useWebSocket';
import AlarmTab from './alarmTab';

// 상대 시간을 계산하는 함수
const getRelativeTime = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) {
        return '방금 전';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}분 전`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}시간 전`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 전`;
};

const NotificationScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    // SSE 훅을 통해 실시간 알림 데이터를 가져옴 (액세스 토큰으로 사용자 식별)
    const { notifications, deleteNotification } = useWebSocket();

    // 읽지 않은 알림 개수 계산 ('read: false'인 항목)
    const unreadCount = notifications.filter(n => !n.read).length;

    // 스와이프 시 삭제 버튼 렌더링
    const renderRightActions = (item) => (
        <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteNotification(item.id)}
        >
            <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => {
        // 제목에 따라 아이콘 결정
        let iconSource = null;
        if (item.title === '가입거절') {
            iconSource = require('@/assets/images/rejected.svg');
        } else if (item.title === '가입승인') {
            iconSource = require('@/assets/images/accepted.svg');
        }

        return (
            <Swipeable renderRightActions={() => renderRightActions(item)}>
                <View style={[styles.notificationItem, item.read ? styles.read : styles.unread]}>
                    <Text style={styles.time}>{getRelativeTime(item.timestamp)}</Text>
                    <View style={styles.notificationContent}>
                        <View style={styles.titleRow}>
                            <View style={styles.titleWithIcon}>
                                {iconSource && (
                                    <Image
                                        source={iconSource}
                                        style={styles.notificationIcon}
                                        contentFit="contain"
                                    />
                                )}
                                <Text style={styles.itemTitle}>{item.title}</Text>
                            </View>
                        </View>
                        <Text style={styles.message}>{item.message}</Text>
                    </View>
                </View>
            </Swipeable>
        );
    };

    return (
        <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
            <View style={styles.headerBar}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('/My/my')}
                >
                    <Image source={require('@/assets/images/left.svg')} style={styles.backButtonIcon} contentFit="contain" />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>
                    수신함
                </Text>
            </View>

            <View style={styles.fixedAlarmTab}>
                <AlarmTab />
            </View>
            
            <FlatList
                style={styles.flatList}
                contentContainerStyle={styles.flatListContent}
                data={notifications}
                renderItem={renderItem}
                // KeyExtractor는 알림의 고유 ID를 사용해야 하지만, 모의 데이터에서는 index 사용
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                ListEmptyComponent={<Text style={styles.empty}>도착한 알림이 없습니다.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerBar: {
        height: 44, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
    },
    backButton: {
        padding: 8,
        position: 'absolute', 
        left: 10,
        zIndex: 1,
    },
    backButtonIcon: {
        width: 28,
        height: 28,
    },
    backButtonText: {
        fontSize: 28,
        color: '#000',
        fontWeight: 'bold',
    },
    screenTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
        fontFamily: 'Pretendard-SemiBold',
    },
    fixedAlarmTab: {
        backgroundColor: '#FFFFFF',
        zIndex: 10, 
    },
    flatList: {
        flex: 1,
    },
    flatListContent: {
        paddingBottom: 100,
    },
    notificationItem: {
        position: 'relative',
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 8,
        elevation: 1
    },
    notificationContent: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
        marginBottom: 5
    },
    unread: { 
        backgroundColor: '#ffffff', 
        borderWidth: 2, 
        borderColor: '#E6E6E6' 
    },
    read: { 
        backgroundColor: '#ffffff', 
        borderLeftWidth: 5, 
        borderLeftColor: '#ddd' 
    },
    itemTitle: { 
        fontSize: 18,
        fontFamily: 'Pretendard-SemiBold',
        marginBottom: 5
    },
    message: { 
        fontSize: 14, 
        marginLeft: 25,
        color: '#333',
        fontFamily: 'Pretendard-Regular',
    },
    time: {
        position: 'absolute',
        top: 10,
        right: 15,
        fontSize: 12,
        color: '#999',
        fontFamily: 'Pretendard-Regular',
    },
    empty: { 
        textAlign: 'center', 
        marginTop: 50, 
        color: '#aaa',
        fontFamily: 'Pretendard-Regular',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        marginVertical: 5,
        marginRight: 10,
        borderRadius: 8,
    },
    deleteButtonText: {
        color: '#FFFFFF',
        fontFamily: 'Pretendard-SemiBold',
        fontSize: 16,
    }
});

export default NotificationScreen;